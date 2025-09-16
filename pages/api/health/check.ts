import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      services: {
        database: 'unknown',
        email: 'unknown',
        google: 'unknown',
        replicate: 'unknown'
      },
      configuration: {
        nextAuthUrl: !!process.env.NEXTAUTH_URL,
        nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        emailHost: !!process.env.EMAIL_SERVER_HOST,
        emailUser: !!process.env.EMAIL_SERVER_USER,
        emailPass: !!process.env.EMAIL_SERVER_PASS,
        googleClientId: !!process.env.GOOGLE_CLIENT_ID,
        googleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        replicateApiKey: !!process.env.REPLICATE_API_KEY,
        databaseUrl: !!process.env.DATABASE_URL
      }
    };

    // 检查数据库连接
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.$queryRaw`SELECT 1`;
      health.services.database = 'connected';
      await prisma.$disconnect();
    } catch (error) {
      health.services.database = 'error';
      console.error('Database health check failed:', error);
    }

    // 检查邮箱配置
    if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASS) {
      health.services.email = 'configured';
    } else {
      health.services.email = 'not_configured';
    }

    // 检查 Google OAuth 配置
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      health.services.google = 'configured';
    } else {
      health.services.google = 'not_configured';
    }

    // 检查 Replicate API 配置
    if (process.env.REPLICATE_API_KEY) {
      health.services.replicate = 'configured';
    } else {
      health.services.replicate = 'not_configured';
    }

    // 确定整体状态
    const criticalServices = ['database'];
    const hasCriticalErrors = criticalServices.some(service => health.services[service as keyof typeof health.services] === 'error');
    
    if (hasCriticalErrors) {
      health.status = 'error';
      return res.status(500).json(health);
    }

    return res.status(200).json(health);
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
}

