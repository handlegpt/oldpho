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

    const page = parseInt(req.query.page as string) || 1;
    const search = req.query.search as string || '';
    const limit = 20;
    const offset = (page - 1) * limit;

    // Build search conditions
    const searchConditions = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    // Get users with pagination and search
    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where: searchConditions,
        include: {
          restorations: {
            select: {
              id: true,
              createdAt: true
            }
          },
          subscription: {
            select: {
              planId: true,
              status: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.user.count({
        where: searchConditions
      })
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      users,
      totalUsers,
      totalPages,
      currentPage: page,
      limit
    });

  } catch (error) {
    console.error('Admin users API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
