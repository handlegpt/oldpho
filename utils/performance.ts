import { ErrorRetryManager, getErrorDetails, ErrorDetails, errorAnalytics } from './errorHandling';
import { Language } from './translations';

export interface ProcessingOptions {
  maxRetries: number;
  retryDelay: number;
  timeout: number;
  enableCaching: boolean;
  enableErrorTracking: boolean;
  language: Language;
}

export const defaultProcessingOptions: ProcessingOptions = {
  maxRetries: 3,
  retryDelay: 2000,
  timeout: 120000, // 2分钟
  enableCaching: true,
  enableErrorTracking: true,
  language: 'zh-TW'
};

export class ProcessingManager {
  private cache = new Map<string, any>();
  private processingQueue = new Map<string, Promise<any>>();
  private errorRetryManager: ErrorRetryManager;
  private options: ProcessingOptions;

  constructor(options: Partial<ProcessingOptions> = {}) {
    this.options = { ...defaultProcessingOptions, ...options };
    this.errorRetryManager = new ErrorRetryManager({
      maxRetries: this.options.maxRetries,
      retryDelay: this.options.retryDelay,
      backoffMultiplier: 2,
      maxDelay: 10000
    });
  }

  async processWithRetry<T>(
    processor: () => Promise<T>,
    options: Partial<ProcessingOptions> = {}
  ): Promise<T> {
    const opts = { ...this.options, ...options };
    let lastError: Error;

    for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
      try {
        return await Promise.race([
          processor(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Processing timeout')), opts.timeout)
          )
        ]);
      } catch (error) {
        lastError = error as Error;
        const errorDetails = getErrorDetails(error, opts.language);
        
        // 记录错误
        if (opts.enableErrorTracking) {
          errorAnalytics.addError(errorDetails);
          console.warn(`Processing attempt ${attempt} failed:`, errorDetails);
        }
        
        // 如果错误不可重试，直接抛出
        if (!errorDetails.retryable) {
          throw error;
        }
        
        if (attempt < opts.maxRetries) {
          const delay = opts.retryDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  async getCachedResult<T>(key: string, processor: () => Promise<T>): Promise<T> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // 防止重复处理同一请求
    if (this.processingQueue.has(key)) {
      return this.processingQueue.get(key)!;
    }

    const promise = processor().then(result => {
      this.cache.set(key, result);
      this.processingQueue.delete(key);
      return result;
    });

    this.processingQueue.set(key, promise);
    return promise;
  }

  async processWithErrorHandling<T>(
    processor: () => Promise<T>,
    errorHandler?: (error: ErrorDetails) => void
  ): Promise<T> {
    try {
      return await this.processWithRetry(processor);
    } catch (error) {
      const errorDetails = getErrorDetails(error, this.options.language);
      
      if (errorHandler) {
        errorHandler(errorDetails);
      }
      
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }

  getProcessingQueueSize() {
    return this.processingQueue.size;
  }

  getErrorStats() {
    return errorAnalytics.getErrorStats();
  }

  updateOptions(options: Partial<ProcessingOptions>) {
    this.options = { ...this.options, ...options };
    this.errorRetryManager = new ErrorRetryManager({
      maxRetries: this.options.maxRetries,
      retryDelay: this.options.retryDelay,
      backoffMultiplier: 2,
      maxDelay: 10000
    });
  }
}

// 图片处理优化
export const optimizeImageForProcessing = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      try {
        // 计算最佳尺寸
        const maxSize = 1024;
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        
        // 绘制并压缩
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(optimizedFile);
          } else {
            reject(new Error('Failed to optimize image'));
          }
        }, 'image/jpeg', 0.8);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for optimization'));
    };

    img.src = URL.createObjectURL(file);
  });
};

// 进度追踪
export class ProgressTracker {
  private startTime: number;
  private updateCallback: (progress: number, message: string) => void;
  private intervalId?: any;

  constructor(updateCallback: (progress: number, message: string) => void) {
    this.startTime = Date.now();
    this.updateCallback = updateCallback;
  }

  update(progress: number, message: string) {
    this.updateCallback(progress, message);
  }

  startAutoProgress(estimatedDuration: number = 60000) {
    let progress = 0;
    const increment = 100 / (estimatedDuration / 1000);
    
    this.intervalId = setInterval(() => {
      progress = Math.min(progress + increment, 95); // 最多到95%，等待实际完成
      this.update(progress, '处理中...');
    }, 1000);
  }

  stopAutoProgress() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  getElapsedTime(): number {
    return Date.now() - this.startTime;
  }

  getEstimatedTimeRemaining(progress: number): number {
    if (progress <= 0) return 0;
    const elapsed = this.getElapsedTime();
    return (elapsed / progress) * (100 - progress);
  }

  formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}小时${minutes % 60}分钟`;
    } else if (minutes > 0) {
      return `${minutes}分钟${seconds % 60}秒`;
    } else {
      return `${seconds}秒`;
    }
  }
}

// 性能监控
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private startTimes: Map<string, number> = new Map();

  startTimer(operation: string): void {
    this.startTimes.set(operation, Date.now());
  }

  endTimer(operation: string): number {
    const startTime = this.startTimes.get(operation);
    if (!startTime) {
      throw new Error(`Timer for operation '${operation}' was not started`);
    }

    const duration = Date.now() - startTime;
    this.startTimes.delete(operation);

    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(duration);

    return duration;
  }

  getAverageTime(operation: string): number {
    const times = this.metrics.get(operation);
    if (!times || times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  getMinTime(operation: string): number {
    const times = this.metrics.get(operation);
    if (!times || times.length === 0) return 0;
    
    return Math.min(...times);
  }

  getMaxTime(operation: string): number {
    const times = this.metrics.get(operation);
    if (!times || times.length === 0) return 0;
    
    return Math.max(...times);
  }

  getOperationCount(operation: string): number {
    const times = this.metrics.get(operation);
    return times ? times.length : 0;
  }

  clearMetrics(): void {
    this.metrics.clear();
    this.startTimes.clear();
  }

  getPerformanceReport(): Record<string, {
    count: number;
    average: number;
    min: number;
    max: number;
  }> {
    const report: Record<string, any> = {};
    
    this.metrics.forEach((times, operation) => {
      report[operation] = {
        count: times.length,
        average: this.getAverageTime(operation),
        min: this.getMinTime(operation),
        max: this.getMaxTime(operation)
      };
    });
    
    return report;
  }
}

// 全局性能监控实例
export const performanceMonitor = new PerformanceMonitor();

// 用户行为追踪
export class UserBehaviorTracker {
  private events: Array<{
    type: string;
    timestamp: number;
    data?: any;
  }> = [];

  trackEvent(type: string, data?: any) {
    this.events.push({
      type,
      timestamp: Date.now(),
      data
    });

    // 限制事件数量，避免内存泄漏
    if (this.events.length > 1000) {
      this.events = this.events.slice(-500);
    }

    // 发送到分析服务
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', type, data || {});
    }
  }

  trackPageView(page: string) {
    this.trackEvent('page_view', { page });
  }

  trackLanguageChange(language: string) {
    this.trackEvent('language_change', { language });
  }

  trackPhotoUpload() {
    this.trackEvent('photo_upload');
  }

  trackPhotoRestore() {
    this.trackEvent('photo_restore');
  }

  trackError(error: ErrorDetails) {
    this.trackEvent('error', {
      code: error.code,
      category: error.category,
      severity: error.severity
    });
  }

  getEvents() {
    return [...this.events];
  }

  clearEvents() {
    this.events = [];
  }
}

export const userBehaviorTracker = new UserBehaviorTracker(); 