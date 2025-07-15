import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 检查关键环境变量
  const authConfig = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
    EMAIL_SERVER: process.env.EMAIL_SERVER ? 'Set' : 'Not set',
    EMAIL_FROM: process.env.EMAIL_FROM,
    NODE_ENV: process.env.NODE_ENV,
  };

  // 检查URL配置
  const urlCheck = {
    currentUrl: req.headers.host,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    protocol: req.headers['x-forwarded-proto'] || 'http',
  };

  res.status(200).json({
    message: 'Auth configuration debug info',
    authConfig,
    urlCheck,
    timestamp: new Date().toISOString(),
  });
} 