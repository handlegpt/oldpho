import { getErrorDetails } from './errorHandling';

// 添加 Node.js 类型支持
declare global {
  var process: {
    env: {
      REPLICATE_API_KEY?: string;
      OPENAI_API_KEY?: string;
      NODE_ENV?: string;
    };
  };
}

// 模型提供商接口
interface ModelProvider {
  name: string;
  apiKey: string | null;
  endpoint: string;
  costPerRequest: number;
  rateLimit: number;
  priority: number;
  enabled: boolean;
}

// 处理结果接口
interface ProcessingResult {
  success: boolean;
  result?: string;
  error?: string;
  provider: string;
  cost: number;
  processingTime: number;
}

// 队列任务接口
interface QueueTask {
  id: string;
  image: Buffer;
  priority: number;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  provider?: string;
}

class ModelFallbackManager {
  private providers: ModelProvider[] = [
    {
      name: 'replicate',
      apiKey: process.env.REPLICATE_API_KEY || null,
      endpoint: 'replicate',
      costPerRequest: 0.01,
      rateLimit: 100,
      priority: 1,
      enabled: true
    },
    {
      name: 'openai',
      apiKey: process.env.OPENAI_API_KEY || null,
      endpoint: 'openai',
      costPerRequest: 0.02,
      rateLimit: 50,
      priority: 2,
      enabled: !!process.env.OPENAI_API_KEY
    },
    {
      name: 'local',
      apiKey: null,
      endpoint: 'local',
      costPerRequest: 0,
      rateLimit: 1000,
      priority: 3,
      enabled: process.env.NODE_ENV === 'development'
    }
  ];

  private queue: QueueTask[] = [];
  private processing = false;
  private maxConcurrent = 3;
  private currentConcurrent = 0;
  private providerStats = new Map<string, { success: number; failure: number; totalCost: number }>();

  constructor() {
    this.initializeProviderStats();
  }

  private initializeProviderStats() {
    this.providers.forEach(provider => {
      this.providerStats.set(provider.name, { success: 0, failure: 0, totalCost: 0 });
    });
  }

  // 获取可用的提供商（按优先级排序）
  private getAvailableProvidersList(): ModelProvider[] {
    return this.providers
      .filter(provider => provider.enabled && provider.apiKey)
      .sort((a, b) => a.priority - b.priority);
  }

  // 处理图片（带 fallback）
  async processWithFallback(image: Buffer, priority: number = 1): Promise<ProcessingResult> {
    const task: QueueTask = {
      id: Date.now().toString(),
      image,
      priority,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3
    };

    return this.addToQueue(task);
  }

  // 添加到队列
  private async addToQueue(task: QueueTask): Promise<ProcessingResult> {
    return new Promise((resolve, reject) => {
      this.queue.push(task);
      this.queue.sort((a, b) => b.priority - a.priority);
      
      // 设置超时
      const timeout = setTimeout(() => {
        reject(new Error('Processing timeout'));
      }, 300000); // 5分钟超时

      // 处理队列
      this.processQueue().then(result => {
        clearTimeout(timeout);
        resolve(result);
      }).catch(error => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  // 处理队列
  private async processQueue(): Promise<ProcessingResult> {
    if (this.processing || this.currentConcurrent >= this.maxConcurrent) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.processQueue().then(resolve).catch(reject);
        }, 1000);
      });
    }

    const task = this.queue.shift();
    if (!task) {
      throw new Error('No tasks in queue');
    }

    this.currentConcurrent++;
    this.processing = true;

    try {
      const result = await this.processTask(task);
      this.updateProviderStats(result.provider, true, result.cost);
      return result;
    } catch (error) {
      this.updateProviderStats(task.provider || 'unknown', false, 0);
      
      // 重试逻辑
      if (task.retryCount < task.maxRetries) {
        task.retryCount++;
        this.queue.unshift(task);
        return this.processQueue();
      }
      
      throw error;
    } finally {
      this.currentConcurrent--;
      this.processing = false;
      
      // 继续处理队列
      if (this.queue.length > 0) {
        this.processQueue();
      }
    }
  }

  // 处理单个任务
  private async processTask(task: QueueTask): Promise<ProcessingResult> {
    const providers = this.getAvailableProvidersList();
    const startTime = Date.now();

    for (const provider of providers) {
      try {
        console.log(`Trying provider: ${provider.name}`);
        
        const result = await this.processWithProvider(provider, task.image);
        const processingTime = Date.now() - startTime;
        
        return {
          success: true,
          result,
          provider: provider.name,
          cost: provider.costPerRequest,
          processingTime
        };
      } catch (error) {
        console.warn(`Provider ${provider.name} failed:`, error);
        
        // 检查是否是配额限制错误
        const errorDetails = getErrorDetails(error);
        if (errorDetails.code === 'REPLICATE_QUOTA_EXCEEDED' || 
            errorDetails.code === 'RATE_LIMIT_EXCEEDED') {
          // 暂时禁用该提供商
          provider.enabled = false;
          setTimeout(() => {
            provider.enabled = true;
          }, 60000); // 1分钟后重新启用
        }
        
        continue;
      }
    }

    throw new Error('All providers failed');
  }

  // 使用特定提供商处理
  private async processWithProvider(provider: ModelProvider, image: Buffer): Promise<string> {
    switch (provider.name) {
      case 'replicate':
        return this.processWithReplicate(image);
      case 'openai':
        return this.processWithOpenAI(image);
      case 'local':
        return this.processWithLocal(image);
      default:
        throw new Error(`Unknown provider: ${provider.name}`);
    }
  }

  // Replicate 处理
  private async processWithReplicate(image: Buffer): Promise<string> {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
        input: {
          image: `data:image/jpeg;base64,${image.toString('base64')}`,
          scale: 2,
          face_enhance: true,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Replicate API error: ${error}`);
    }

    const prediction = await response.json();
    
    // 轮询结果
    let result;
    while (true) {
      const pollResponse = await fetch(prediction.urls.get, {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
        },
      });
      
      result = await pollResponse.json();
      
      if (result.status === 'succeeded') {
        return result.output;
      } else if (result.status === 'failed') {
        throw new Error(`Processing failed: ${result.error}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // OpenAI 处理
  private async processWithOpenAI(image: Buffer): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: `data:image/jpeg;base64,${image.toString('base64')}`,
        prompt: 'Restore and enhance this old photo, improve quality and clarity',
        n: 1,
        size: '1024x1024',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const result = await response.json();
    return result.data[0].url;
  }

  // 本地处理（开发环境）
  private async processWithLocal(image: Buffer): Promise<string> {
    // 模拟本地处理
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `data:image/jpeg;base64,${image.toString('base64')}`;
  }

  // 更新提供商统计
  private updateProviderStats(providerName: string, success: boolean, cost: number) {
    const stats = this.providerStats.get(providerName) || { success: 0, failure: 0, totalCost: 0 };
    
    if (success) {
      stats.success++;
    } else {
      stats.failure++;
    }
    
    stats.totalCost += cost;
    this.providerStats.set(providerName, stats);
  }

  // 获取队列状态
  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      currentConcurrent: this.currentConcurrent,
      maxConcurrent: this.maxConcurrent,
      processing: this.processing
    };
  }

  // 获取提供商统计
  getProviderStats() {
    const stats: Record<string, any> = {};
    this.providerStats.forEach((value, key) => {
      stats[key] = {
        ...value,
        successRate: value.success + value.failure > 0 
          ? (value.success / (value.success + value.failure) * 100).toFixed(2) + '%'
          : '0%'
      };
    });
    return stats;
  }

  // 获取可用提供商
  getAvailableProviders() {
    return this.getAvailableProvidersList().map(p => ({
      name: p.name,
      priority: p.priority,
      costPerRequest: p.costPerRequest,
      rateLimit: p.rateLimit
    }));
  }

  // 清理队列
  clearQueue() {
    this.queue = [];
  }

  // 设置并发限制
  setMaxConcurrent(max: number) {
    this.maxConcurrent = Math.max(1, Math.min(max, 10));
  }
}

// 导出单例实例
export default new ModelFallbackManager(); 