// AI 提供商管理
export interface AIProvider {
  name: string;
  apiKey: string;
  endpoint: string;
  costPerRequest: number;
  rateLimit: number;
  isAvailable: boolean;
}

export class AIProviderManager {
  private providers: AIProvider[] = [
    {
      name: 'replicate',
      apiKey: process.env.REPLICATE_API_KEY || '',
      endpoint: 'replicate',
      costPerRequest: 0.01,
      rateLimit: 100,
      isAvailable: true
    },
    {
      name: 'google-gemini-flash',
      apiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
      endpoint: 'google-gemini-flash',
      costPerRequest: 0.015, // Gemini 2.5 Flash 更便宜
      rateLimit: 100,
      isAvailable: true
    },
    {
      name: 'openai-dalle',
      apiKey: process.env.OPENAI_API_KEY || '',
      endpoint: 'openai-dalle',
      costPerRequest: 0.04,
      rateLimit: 25,
      isAvailable: false // 暂时不可用
    }
  ];

  async processImageWithFallback(imageData: string): Promise<string> {
    for (const provider of this.providers) {
      if (!provider.isAvailable || !provider.apiKey) {
        continue;
      }

      try {
        console.log(`尝试使用 ${provider.name} 处理图片...`);
        const result = await this.processWithProvider(provider, imageData);
        console.log(`${provider.name} 处理成功`);
        return result;
      } catch (error) {
        console.warn(`${provider.name} 处理失败:`, error);
        continue;
      }
    }
    
    throw new Error('所有 AI 提供商都不可用');
  }

  private async processWithProvider(provider: AIProvider, imageData: string): Promise<string> {
    switch (provider.name) {
      case 'replicate':
        return await this.processWithReplicate(imageData);
      case 'google-gemini-flash':
        return await this.processWithGeminiFlash(imageData);
      case 'openai-dalle':
        return await this.processWithOpenAI(imageData);
      default:
        throw new Error(`不支持的提供商: ${provider.name}`);
    }
  }

  private async processWithReplicate(imageData: string): Promise<string> {
    const { replicate } = await import('./replicate');
    return await replicate.run(
      "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
      {
        input: {
          img: imageData,
          version: "v1.4",
          scale: 2
        }
      }
    );
  }

  private async processWithGeminiFlash(imageData: string): Promise<string> {
    const { geminiClient } = await import('./gemini');
    return await geminiClient.enhanceImage(imageData);
  }

  private async processWithOpenAI(imageData: string): Promise<string> {
    // OpenAI DALL-E API 集成
    // 需要实现图像修复功能
    throw new Error('OpenAI DALL-E API 暂未实现');
  }

  // 更新提供商状态
  updateProviderStatus(name: string, isAvailable: boolean): void {
    const provider = this.providers.find(p => p.name === name);
    if (provider) {
      provider.isAvailable = isAvailable;
    }
  }

  // 获取可用提供商列表
  getAvailableProviders(): AIProvider[] {
    return this.providers.filter(p => p.isAvailable && p.apiKey);
  }
}

export const aiProviderManager = new AIProviderManager();
