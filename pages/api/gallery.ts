import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import prisma from '../../lib/prismadb';
import * as fs from 'fs';
import * as path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Gallery API: Method:', req.method);
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    console.log('Gallery API: Session:', session?.user?.email);
    
    if (!session?.user?.email) {
      console.log('Gallery API: Unauthorized');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        restorations: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    console.log('Gallery API: User found:', !!user, 'Restorations count:', user?.restorations?.length);

    if (!user) {
      console.log('Gallery API: User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Process restoration records to include file information
    const galleryItems = await Promise.all(
      user.restorations.map(async (restoration: any) => {
        try {
          // Get file sizes
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

          return {
            id: restoration.id,
            originalImage: restoration.originalImage,
            restoredImage: restoration.restoredImage,
            fileName: path.basename(restoration.originalImage),
            originalSize,
            restoredSize,
            totalSize: originalSize + restoredSize,
            status: restoration.status,
            processingTime: restoration.processingTime,
            createdAt: restoration.createdAt,
            updatedAt: restoration.updatedAt
          };
        } catch (error) {
          console.error('Error processing restoration:', restoration.id, error);
          return {
            id: restoration.id,
            originalImage: restoration.originalImage,
            restoredImage: restoration.restoredImage,
            fileName: path.basename(restoration.originalImage),
            originalSize: 0,
            restoredSize: 0,
            totalSize: 0,
            status: restoration.status,
            processingTime: restoration.processingTime,
            createdAt: restoration.createdAt,
            updatedAt: restoration.updatedAt
          };
        }
      })
    );

    return res.status(200).json(galleryItems);

  } catch (error) {
    console.error('Gallery API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
