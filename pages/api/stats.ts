import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import prisma from '../../lib/prismadb';

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
        restorations: true,
        subscription: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate statistics
    const totalRestorations = user.restorations.length;
    
    // Calculate this month's restorations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthRestorations = user.restorations.filter(
      restoration => restoration.createdAt >= startOfMonth
    ).length;

    // Get plan type
    const planType = user.subscription?.planId || 'free';
    
    // Calculate remaining generations (free plan: 5 per month)
    const remainingGenerations = planType === 'free' 
      ? Math.max(0, 5 - thisMonthRestorations)
      : 999; // Unlimited for paid plans

    // Calculate storage usage (simplified - count total file size)
    const totalStorage = planType === 'free' ? 100 : 1000; // MB
    const usedStorage = Math.min(totalRestorations * 2, totalStorage); // Estimate 2MB per image

    // Get join date
    const joinDate = user.createdAt || new Date();

    const stats = {
      totalRestorations,
      remainingGenerations,
      planType,
      joinDate: joinDate.toISOString(),
      thisMonthRestorations,
      totalStorage,
      usedStorage
    };

    return res.status(200).json(stats);

  } catch (error) {
    console.error('Stats API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
