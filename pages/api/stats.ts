import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import prisma from '../../lib/prismadb';
import { Restoration } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

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

    console.log('Stats API: User found:', !!user, 'Email:', session.user.email);
    console.log('Stats API: User restorations count:', user?.restorations?.length);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate statistics
    const totalRestorations = user.restorations.length;
    console.log('Stats API: Total restorations calculated:', totalRestorations);
    
    // Calculate this month's restorations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthRestorations = user.restorations.filter(
      (restoration: Restoration) => restoration.createdAt >= startOfMonth
    ).length;

    // Get plan type
    const planType = user.subscription?.planId || 'free';
    
    // Calculate remaining generations (free plan: 5 per month)
    const remainingGenerations = planType === 'free' 
      ? Math.max(0, 5 - thisMonthRestorations)
      : 999; // Unlimited for paid plans

    // Calculate storage usage (precise - actual file sizes)
    const totalStorage = planType === 'free' ? 100 : 1000; // MB
    
    // Calculate actual storage used by summing file sizes
    let usedStorage = 0;
    try {
      const storageUsed = await Promise.all(
        user.restorations.map(async (restoration: any) => {
          try {
            const originalPath = path.join(process.cwd(), 'public', restoration.originalImage);
            const restoredPath = path.join(process.cwd(), 'public', restoration.restoredImage);
            
            let originalSize = 0;
            let restoredSize = 0;
            
            if (fs.existsSync(originalPath)) {
              originalSize = fs.statSync(originalPath).size;
            }
            
            if (fs.existsSync(restoredPath)) {
              restoredSize = fs.statSync(restoredPath).size;
            }
            
            return originalSize + restoredSize;
          } catch (error) {
            console.error('Error calculating file size for restoration:', restoration.id, error);
            return 0;
          }
        })
      );
      
      usedStorage = storageUsed.reduce((sum: number, size: number) => sum + size, 0) / (1024 * 1024); // Convert to MB
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      // Fallback to estimation
      usedStorage = Math.min(totalRestorations * 2, totalStorage);
    }

    // Get join date - use the earliest restoration date or current date
    const joinDate = user.restorations.length > 0 
      ? new Date(Math.min(...user.restorations.map(r => r.createdAt.getTime())))
      : new Date();

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
