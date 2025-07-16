import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 检查生产环境配置
  const productionConfig = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
    EMAIL_SERVER: process.env.EMAIL_SERVER ? 'Set' : 'Not set',
    EMAIL_FROM: process.env.EMAIL_FROM,
  };

  // 检查请求信息
  const requestInfo = {
    host: req.headers.host,
    protocol: req.headers['x-forwarded-proto'] || 'http',
    userAgent: req.headers['user-agent'],
    referer: req.headers.referer,
  };

  // 检查URL匹配
  const urlMatch = {
    expectedUrl: process.env.NEXTAUTH_URL,
    actualHost: req.headers.host,
    isMatched: process.env.NEXTAUTH_URL?.includes(req.headers.host || ''),
  };

  // 检查是否有认证提供者
  const providers = {
    hasGoogle: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    hasEmail: !!(process.env.EMAIL_SERVER && process.env.EMAIL_FROM),
    hasAnyProvider: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) || !!(process.env.EMAIL_SERVER && process.env.EMAIL_FROM),
  };

  res.status(200).json({
    message: 'Production environment debug info',
    productionConfig,
    requestInfo,
    urlMatch,
    providers,
    timestamp: new Date().toISOString(),
  });
} 