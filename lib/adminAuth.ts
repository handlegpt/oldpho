import { getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import prisma from './prismadb';
import { NextApiRequest, NextApiResponse } from 'next';

export interface AdminUser {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
}

export async function checkAdminAuth(req: NextApiRequest, res: NextApiResponse): Promise<AdminUser | null> {
  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      console.log('Admin auth failed: No session or email');
      return null;
    }

    // Get user from database with role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      console.log('Admin auth failed: User not found in database');
      return null;
    }

    // Check if user has admin role
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      console.log('Admin auth failed: User role is not admin', { email: user.email, role: user.role });
      return null;
    }

    console.log('Admin auth successful:', { email: user.email, role: user.role });
    return user;
  } catch (error) {
    console.error('Admin auth check error:', error);
    return null;
  }
}

export async function requireAdminAuth(req: NextApiRequest, res: NextApiResponse): Promise<AdminUser> {
  const adminUser = await checkAdminAuth(req, res);
  
  if (!adminUser) {
    res.status(403).json({ 
      error: 'Forbidden',
      message: 'Admin access required'
    });
    throw new Error('Admin access required');
  }
  
  return adminUser;
}

export function isAdmin(role: string): boolean {
  return role === 'admin' || role === 'super_admin';
}

export function isSuperAdmin(role: string): boolean {
  return role === 'super_admin';
}
