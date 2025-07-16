import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import modelFallbackManager from '../../utils/modelFallback';
import smartCache from '../../utils/smartCache';
import { getErrorDetails } from '../../utils/errorHandling';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 获取用户会话
    const session = await getServerSession(req, res, {});
    
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // 检查请求体
    const { image, priority = 1 } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // 验证图片数据
    if (!image.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    // 转换 base64 为 Buffer
    const base64Data = image.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // 生成缓存键
    const cacheKey = `restore_${session.user.email}_${Buffer.from(imageBuffer).toString('hex').substring(0, 16)}`;

    // 尝试从缓存获取
    const cachedResult = smartCache.get<string>(cacheKey);
    if (cachedResult) {
      console.log('Cache hit for image restoration');
      return res.status(200).json({
        success: true,
        result: cachedResult,
        cached: true,
        provider: 'cache',
        processingTime: 0
      });
    }

    // 使用多模型 fallback 处理
    console.log('Processing image with fallback system...');
    const startTime = Date.now();
    
    const result = await modelFallbackManager.processWithFallback(imageBuffer, priority);
    const processingTime = Date.now() - startTime;

    // 缓存结果（1小时）
    smartCache.set(cacheKey, result.result, 3600000, result.cost);

    // 返回结果
    res.status(200).json({
      success: true,
      result: result.result,
      provider: result.provider,
      cost: result.cost,
      processingTime: result.processingTime,
      cached: false
    });

  } catch (error) {
    console.error('Enhanced restore API error:', error);
    
    const errorDetails = getErrorDetails(error);
    
    res.status(500).json({
      success: false,
      error: errorDetails.userMessage,
      code: errorDetails.code,
      suggestions: errorDetails.suggestions
    });
  }
}

// 获取系统状态
export async function getSystemStatus(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const queueStatus = modelFallbackManager.getQueueStatus();
    const providerStats = modelFallbackManager.getProviderStats();
    const availableProviders = modelFallbackManager.getAvailableProviders();
    const cacheStats = smartCache.getStats();

    res.status(200).json({
      queue: queueStatus,
      providers: {
        stats: providerStats,
        available: availableProviders
      },
      cache: cacheStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('System status error:', error);
    res.status(500).json({ error: 'Failed to get system status' });
  }
} 