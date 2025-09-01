// AI 提供商管理
export interface AIProvider {
  name: string;
  apiKey: string;
  endpoint: string;
  costPerRequest: number;
  rateLimit: number;
  isAvailable: boolean;
  models?: string[];
  description?: string;
}

export interface RestorationRequest {
  imageData: string;
  enhancementType: 'basic' | 'face' | 'color' | 'upscale' | 'full';
  options?: {
    faceEnhancement?: boolean;
    colorization?: boolean;
    upscaling?: boolean;
    scale?: number;
  };
}

export class AIProviderManager {
  private providers: AIProvider[] = [
    {
      name: 'google-gemini-flash',
      apiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
      endpoint: 'google-gemini-flash',
      costPerRequest: 0.015,
      rateLimit: 100,
      isAvailable: true,
      description: 'Google Gemini 2.5 Flash - 简单快速，适合快速修复'
    },
    {
      name: 'replicate-gfpgan',
      apiKey: process.env.REPLICATE_API_KEY || '',
      endpoint: 'replicate',
      costPerRequest: 0.008,
      rateLimit: 100,
      isAvailable: true,
      models: ['tencentarc/gfpgan'],
      description: 'GFPGAN - 专为老旧人脸修复和特征重建而生'
    },
    {
      name: 'replicate-codeformer',
      apiKey: process.env.REPLICATE_API_KEY || '',
      endpoint: 'replicate',
      costPerRequest: 0.01,
      rateLimit: 100,
      isAvailable: true,
      models: ['sczhou/codeformer'],
      description: 'CodeFormer - 高质量人脸修复和增强'
    },
    {
      name: 'replicate-deoldify',
      apiKey: process.env.REPLICATE_API_KEY || '',
      endpoint: 'replicate',
      costPerRequest: 0.012,
      rateLimit: 50,
      isAvailable: true,
      models: ['jantic/neural-enhance'],
      description: 'DeOldify - 老照片上色，真实自然且复古感强'
    },
    {
      name: 'replicate-realesrgan',
      apiKey: process.env.REPLICATE_API_KEY || '',
      endpoint: 'replicate',
      costPerRequest: 0.006,
      rateLimit: 100,
      isAvailable: true,
      models: ['nightmareai/real-esrgan'],
      description: 'Real-ESRGAN - 超分辨率放大，让细节更清晰'
    }
  ];

  async processImageWithFallback(request: RestorationRequest): Promise<string> {
    const { imageData, enhancementType, options } = request;
    
    // 根据增强类型选择最佳提供商
    const selectedProviders = this.selectProvidersForEnhancement(enhancementType);
    
    console.log(`选择提供商进行 ${enhancementType} 增强:`, selectedProviders.map(p => p.name));
    
    for (const provider of selectedProviders) {
      if (!provider.isAvailable || !provider.apiKey) {
        continue;
      }

      try {
        console.log(`尝试使用 ${provider.name} (${provider.description}) 处理图片...`);
        const result = await this.processWithProvider(provider, imageData, options);
        console.log(`${provider.name} 处理成功`);
        return result;
      } catch (error) {
        console.warn(`${provider.name} 处理失败:`, error);
        continue;
      }
    }
    
    throw new Error('所有 AI 提供商都不可用');
  }

  private selectProvidersForEnhancement(enhancementType: string): AIProvider[] {
    switch (enhancementType) {
      case 'basic':
        // 基础修复：Gemini Flash 优先，然后是 GFPGAN
        return this.providers.filter(p => 
          p.name === 'google-gemini-flash' || p.name === 'replicate-gfpgan'
        );
      
      case 'face':
        // 人脸修复：GFPGAN 和 CodeFormer 优先
        return this.providers.filter(p => 
          p.name === 'replicate-gfpgan' || p.name === 'replicate-codeformer' || p.name === 'google-gemini-flash'
        );
      
      case 'color':
        // 上色：DeOldify 优先
        return this.providers.filter(p => 
          p.name === 'replicate-deoldify' || p.name === 'google-gemini-flash'
        );
      
      case 'upscale':
        // 超分辨率：Real-ESRGAN 优先
        return this.providers.filter(p => 
          p.name === 'replicate-realesrgan' || p.name === 'google-gemini-flash'
        );
      
      case 'full':
        // 完整修复：按效果和成本排序
        return this.providers.filter(p => 
          p.name !== 'replicate-deoldify' // 排除上色，因为可能改变原图风格
        );
      
      default:
        return this.providers;
    }
  }

  private async processWithProvider(provider: AIProvider, imageData: string, options?: any): Promise<string> {
    switch (provider.name) {
      case 'google-gemini-flash':
        return await this.processWithGeminiFlash(imageData);
      case 'replicate-gfpgan':
        return await this.processWithReplicateGFPGAN(imageData, options);
      case 'replicate-codeformer':
        return await this.processWithReplicateCodeFormer(imageData, options);
      case 'replicate-deoldify':
        return await this.processWithReplicateDeOldify(imageData, options);
      case 'replicate-realesrgan':
        return await this.processWithReplicateRealESRGAN(imageData, options);
      default:
        throw new Error(`不支持的提供商: ${provider.name}`);
    }
  }

  private async processWithReplicateGFPGAN(imageData: string, options?: any): Promise<string> {
    const { replicate } = await import('./replicate');
    return await replicate.run(
      "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
      {
        input: {
          img: imageData,
          version: "v1.4",
          scale: options?.scale || 2
        }
      }
    );
  }

  private async processWithReplicateCodeFormer(imageData: string, options?: any): Promise<string> {
    const { replicate } = await import('./replicate');
    return await replicate.run(
      "sczhou/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56",
      {
        input: {
          image: imageData,
          background_enhance: true,
          face_upsample: true,
          upscale: options?.scale || 2,
          codeformer_fidelity: 0.7
        }
      }
    );
  }

  private async processWithReplicateDeOldify(imageData: string, options?: any): Promise<string> {
    const { replicate } = await import('./replicate');
    return await replicate.run(
      "jantic/neural-enhance:7d0a4c0afdb1c4f953ccb7c737c03b14e1598b97fe79c02fb5d5d25e53a0b3d8",
      {
        input: {
          image: imageData,
          scale: options?.scale || 2,
          render_factor: 35
        }
      }
    );
  }

  private async processWithReplicateRealESRGAN(imageData: string, options?: any): Promise<string> {
    const { replicate } = await import('./replicate');
    return await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
      {
        input: {
          image: imageData,
          scale: options?.scale || 2,
          face_enhance: options?.faceEnhancement || false
        }
      }
    );
  }

  private async processWithGeminiFlash(imageData: string): Promise<string> {
    const { geminiClient } = await import('./gemini');
    return await geminiClient.enhanceImage(imageData);
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
