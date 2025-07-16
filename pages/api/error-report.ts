import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

interface ErrorReport {
  code: string;
  message: string;
  userMessage: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'api' | 'network' | 'validation' | 'rate_limit' | 'processing' | 'auth' | 'system';
  timestamp: string;
  context?: any;
  userId?: string;
  userAgent?: string;
  url?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 获取用户会话
    const session = await getServerSession(req, res);
    
    const errorReport: ErrorReport = {
      ...req.body,
      userId: session?.user?.email || 'anonymous',
      userAgent: req.headers['user-agent'],
      url: req.headers.referer,
      timestamp: new Date().toISOString()
    };

    // 记录错误到控制台
    console.error('Error Report:', {
      code: errorReport.code,
      message: errorReport.message,
      severity: errorReport.severity,
      category: errorReport.category,
      userId: errorReport.userId,
      timestamp: errorReport.timestamp,
      context: errorReport.context
    });

    // 这里可以添加错误存储逻辑
    // 例如存储到数据库或发送到错误追踪服务
    // await storeErrorReport(errorReport);

    // 根据错误严重程度决定响应
    if (errorReport.severity === 'critical') {
      // 对于严重错误，可以发送通知
      console.error('Critical error detected:', errorReport);
      // await sendAlert(errorReport);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Error report received',
      errorId: `${errorReport.code}_${Date.now()}`
    });

  } catch (error) {
    console.error('Error handling error report:', error);
    return res.status(500).json({ 
      error: 'Failed to process error report' 
    });
  }
} 