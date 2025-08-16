import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prismadb';
import { getUserLimits, checkRestorationLimit, checkStorageLimit, PLAN_LIMITS } from '../../../lib/permissions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscription: true,
        restorations: {
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user plan and limits
    const planId = user.subscription?.planId || 'free';
    const limits = await getUserLimits(user.id);
    const restorationCheck = await checkRestorationLimit(user.id);
    const storageCheck = await checkStorageLimit(user.id);

    // Calculate current usage
    const currentMonthRestorations = user.restorations.length;
    const usedStorage = storageCheck.used;

    const permissions = {
      plan: {
        id: planId,
        name: planId.charAt(0).toUpperCase() + planId.slice(1),
        limits: {
          monthlyRestorations: limits.monthlyRestorations,
          storageLimit: limits.storageLimit,
          maxFileSize: limits.maxFileSize,
          features: limits.features
        }
      },
      usage: {
        monthlyRestorations: currentMonthRestorations,
        remainingRestorations: restorationCheck.remaining,
        usedStorage: usedStorage,
        storageLimit: limits.storageLimit,
        storagePercentage: Math.round((usedStorage / limits.storageLimit) * 100)
      },
      status: {
        canRestore: restorationCheck.allowed,
        canUpload: restorationCheck.allowed && storageCheck.allowed,
        restorationLimitExceeded: !restorationCheck.allowed,
        storageLimitExceeded: !storageCheck.allowed
      },
      limits: {
        restoration: restorationCheck,
        storage: storageCheck
      }
    };

    return res.status(200).json(permissions);

  } catch (error) {
    console.error('Permissions API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
