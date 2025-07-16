import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 检查环境变量
    const emailConfig = {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASS ? '***' : 'NOT_SET',
      from: process.env.EMAIL_FROM,
      nextauth_secret: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
      nextauth_url: process.env.NEXTAUTH_URL
    };

    console.log('Email configuration check:', emailConfig);

    // 检查必要的环境变量
    const missing = [];
    if (!process.env.EMAIL_SERVER_HOST) missing.push('EMAIL_SERVER_HOST');
    if (!process.env.EMAIL_SERVER_USER) missing.push('EMAIL_SERVER_USER');
    if (!process.env.EMAIL_SERVER_PASS) missing.push('EMAIL_SERVER_PASS');
    if (!process.env.NEXTAUTH_SECRET) missing.push('NEXTAUTH_SECRET');

    return res.status(200).json({
      success: true,
      config: emailConfig,
      missing,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug email error:', error);
    
    return res.status(500).json({
      error: 'Debug failed',
      details: error.message
    });
  }
} 