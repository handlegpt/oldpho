import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prismadb';

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

    // TODO: Add admin role check here
    // For now, allow access to any authenticated user
    // You can add role-based access control later

    // Get system statistics
    const [
      totalUsers,
      totalRestorations,
      todayRestorations,
      activeUsers
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total restorations
      prisma.restoration.count(),
      
      // Today's restorations
      prisma.restoration.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      
      // Active users (users with activity in last 24h)
      prisma.user.count({
        where: {
          OR: [
            {
              restorations: {
                some: {
                  createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                  }
                }
              }
            },
            {
              sessions: {
                some: {
                  expires: {
                    gte: new Date()
                  }
                }
              }
            }
          ]
        }
      })
    ]);

    // Calculate storage usage (simplified - estimate based on restorations)
    const storageUsed = totalRestorations * 2; // Estimate 2MB per restoration
    const storageTotal = 1000; // 1GB total storage

    // Determine system status
    let systemStatus: 'healthy' | 'warning' | 'error' = 'healthy';
    
    if (storageUsed > storageTotal * 0.9) {
      systemStatus = 'error';
    } else if (storageUsed > storageTotal * 0.7) {
      systemStatus = 'warning';
    }

    const stats = {
      totalUsers,
      totalRestorations,
      todayRestorations,
      activeUsers,
      systemStatus,
      storageUsed,
      storageTotal
    };

    return res.status(200).json(stats);

  } catch (error) {
    console.error('Admin stats API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
