import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../utils/redis';
import prisma from '../../lib/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      redis: 'unknown',
      replicate: 'unknown'
    }
  };

  try {
    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      health.services.database = 'ok';
    } catch (error) {
      health.services.database = 'error';
      console.error('Database health check failed:', error);
    }

    // Check Redis connection
    try {
      if (redis) {
        await redis.ping();
        health.services.redis = 'ok';
      } else {
        health.services.redis = 'not_configured';
      }
    } catch (error) {
      health.services.redis = 'error';
      console.error('Redis health check failed:', error);
    }

    // Check Replicate API key
    if (process.env.REPLICATE_API_KEY) {
      health.services.replicate = 'configured';
    } else {
      health.services.replicate = 'not_configured';
    }

    // Determine overall status
    const criticalServices = ['database'];
    const hasCriticalErrors = criticalServices.some(
      service => health.services[service as keyof typeof health.services] === 'error'
    );

    if (hasCriticalErrors) {
      health.status = 'error';
      return res.status(503).json(health);
    }

    return res.status(200).json(health);
  } catch (error) {
    console.error('Health check error:', error);
    health.status = 'error';
    return res.status(500).json(health);
  }
} 