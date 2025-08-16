import { NextApiRequest, NextApiResponse } from 'next';
import { requireAdminAuth, isSuperAdmin } from '../../../lib/adminAuth';
import prisma from '../../../lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check admin authentication
    const adminUser = await requireAdminAuth(req, res);
    
    // Only super admins can change roles
    if (!isSuperAdmin(adminUser.role)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Super admin access required to change user roles'
      });
    }

    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'User ID and role are required'
      });
    }

    // Validate role
    const validRoles = ['user', 'admin', 'super_admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Invalid role. Must be one of: user, admin, super_admin'
      });
    }

    // Prevent super admin from removing their own role
    if (userId === adminUser.id && role !== 'super_admin') {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Cannot change your own role from super_admin'
      });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    console.log(`User role updated by ${adminUser.email}: ${updatedUser.email} -> ${role}`);

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: `User role updated to ${role}`
    });

  } catch (error) {
    console.error('Set role API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
