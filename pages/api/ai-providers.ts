import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { aiProviderManager } from '../../lib/aiProviders';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const availableProviders = aiProviderManager.getAvailableProviders();
    
    // 按增强类型分组提供商
    const providersByType = {
      basic: availableProviders.filter(p => 
        p.name === 'google-gemini-flash' || p.name === 'replicate-gfpgan'
      ),
      face: availableProviders.filter(p => 
        p.name === 'replicate-gfpgan' || p.name === 'replicate-codeformer'
      ),
      color: availableProviders.filter(p => 
        p.name === 'replicate-deoldify'
      ),
      upscale: availableProviders.filter(p => 
        p.name === 'replicate-realesrgan'
      ),
      full: availableProviders.filter(p => 
        p.name !== 'replicate-deoldify'
      )
    };

    return res.status(200).json({
      success: true,
      providers: availableProviders,
      providersByType,
      enhancementTypes: {
        basic: {
          name: '基础修复',
          description: '快速修复照片质量，适合一般照片',
          providers: providersByType.basic.map(p => p.name)
        },
        face: {
          name: '人脸修复',
          description: '专门修复人脸细节，适合人像照片',
          providers: providersByType.face.map(p => p.name)
        },
        color: {
          name: '照片上色',
          description: '为黑白照片添加自然色彩',
          providers: providersByType.color.map(p => p.name)
        },
        upscale: {
          name: '超分辨率',
          description: '提高照片分辨率，增强细节',
          providers: providersByType.upscale.map(p => p.name)
        },
        full: {
          name: '完整修复',
          description: '综合修复，包含多种增强效果',
          providers: providersByType.full.map(p => p.name)
        }
      }
    });

  } catch (error) {
    console.error('AI providers API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
