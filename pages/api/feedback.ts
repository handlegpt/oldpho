import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    const { rating, feedback, category, language, timestamp } = req.body;

    // 验证输入
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating' });
    }

    // 构建反馈数据
    const feedbackData = {
      rating: parseInt(rating),
      feedback: feedback || '',
      category: category || 'general',
      language: language || 'en',
      timestamp: timestamp || new Date().toISOString(),
      userId: session?.user?.email || 'anonymous',
      userEmail: session?.user?.email || null,
      userName: session?.user?.name || null,
      userAgent: req.headers['user-agent'] || '',
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
      url: req.headers.referer || ''
    };

    // 这里可以保存到数据库或发送到分析服务
    // 例如：保存到 Prisma 数据库
    // await prisma.feedback.create({ data: feedbackData });

    // 或者发送到外部服务（如 Google Analytics、Mixpanel 等）
    console.log('Feedback received:', feedbackData);

    // 发送到分析服务（示例）
    try {
      await fetch('https://api.analytics-service.com/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
    } catch (error) {
      console.error('Failed to send to analytics service:', error);
    }

    res.status(200).json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 