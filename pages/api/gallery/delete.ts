import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prismadb';
import * as fs from 'fs';
import * as path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { restorationId } = req.body;

    if (!restorationId) {
      return res.status(400).json({ error: 'Restoration ID is required' });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get restoration record
    const restoration = await prisma.restoration.findFirst({
      where: {
        id: restorationId,
        userId: user.id
      }
    });

    if (!restoration) {
      return res.status(404).json({ error: 'Restoration not found' });
    }

    // Delete files from server
    try {
      const originalPath = path.join(process.cwd(), 'public', restoration.originalImage);
      const restoredPath = path.join(process.cwd(), 'public', restoration.restoredImage);

      if (fs.existsSync(originalPath)) {
        fs.unlinkSync(originalPath);
      }

      if (fs.existsSync(restoredPath)) {
        fs.unlinkSync(restoredPath);
      }
    } catch (fileError) {
      console.error('Error deleting files:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await prisma.restoration.delete({
      where: {
        id: restorationId
      }
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Delete API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
