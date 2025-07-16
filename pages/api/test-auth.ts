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

  // 检查是否有至少一个认证提供者
  const hasGoogleProvider = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
  const hasEmailProvider = process.env.EMAIL_SERVER && process.env.EMAIL_FROM;
  const hasAnyProvider = hasGoogleProvider || hasEmailProvider;

  res.status(200).json({
    message: 'Auth configuration test',
    authConfig,
    urlCheck,
    providers: {
      hasGoogleProvider,
      hasEmailProvider,
      hasAnyProvider,
    },
    timestamp: new Date().toISOString(),
  });
} 