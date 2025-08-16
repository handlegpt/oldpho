import prisma from './prismadb';

export interface PlanLimits {
  monthlyRestorations: number;
  storageLimit: number; // MB
  maxFileSize: number; // MB
  features: string[];
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    monthlyRestorations: 5,
    storageLimit: 100,
    maxFileSize: 10,
    features: ['basic_restoration', 'email_support']
  },
  pro: {
    monthlyRestorations: 100,
    storageLimit: 1000,
    maxFileSize: 25,
    features: ['basic_restoration', 'priority_processing', 'email_support', 'priority_support']
  },
  enterprise: {
    monthlyRestorations: 999999, // Unlimited
    storageLimit: 10000,
    maxFileSize: 50,
    features: ['basic_restoration', 'priority_processing', 'email_support', 'priority_support', 'api_access', 'custom_integration']
  }
};

export async function getUserPlan(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true }
  });
  
  return user?.subscription?.planId || 'free';
}

export async function getUserLimits(userId: string): Promise<PlanLimits> {
  const planId = await getUserPlan(userId);
  return PLAN_LIMITS[planId] || PLAN_LIMITS.free;
}

export async function checkRestorationLimit(userId: string): Promise<{ allowed: boolean; remaining: number; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      return { allowed: false, remaining: 0, error: 'User not found' };
    }

    const planId = user.subscription?.planId || 'free';
    const limits = PLAN_LIMITS[planId] || PLAN_LIMITS.free;
    const currentMonthRestorations = user.restorations.length;
    const remaining = Math.max(0, limits.monthlyRestorations - currentMonthRestorations);

    return {
      allowed: remaining > 0,
      remaining,
      error: remaining <= 0 ? `Monthly limit of ${limits.monthlyRestorations} restorations exceeded` : undefined
    };
  } catch (error) {
    console.error('Error checking restoration limit:', error);
    return { allowed: false, remaining: 0, error: 'Failed to check limits' };
  }
}

export async function checkStorageLimit(userId: string): Promise<{ allowed: boolean; used: number; limit: number; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        subscription: true,
        restorations: true
      }
    });

    if (!user) {
      return { allowed: false, used: 0, limit: 0, error: 'User not found' };
    }

    const planId = user.subscription?.planId || 'free';
    const limits = PLAN_LIMITS[planId] || PLAN_LIMITS.free;
    
    // Calculate used storage (simplified - in real implementation, you'd read actual file sizes)
    const usedStorage = user.restorations.length * 2; // Estimate 2MB per restoration
    
    return {
      allowed: usedStorage < limits.storageLimit,
      used: usedStorage,
      limit: limits.storageLimit,
      error: usedStorage >= limits.storageLimit ? `Storage limit of ${limits.storageLimit}MB exceeded` : undefined
    };
  } catch (error) {
    console.error('Error checking storage limit:', error);
    return { allowed: false, used: 0, limit: 0, error: 'Failed to check storage limits' };
  }
}

export async function checkFileSizeLimit(userId: string, fileSize: number): Promise<{ allowed: boolean; error?: string }> {
  try {
    const planId = await getUserPlan(userId);
    const limits = PLAN_LIMITS[planId] || PLAN_LIMITS.free;
    const fileSizeMB = fileSize / (1024 * 1024);
    
    return {
      allowed: fileSizeMB <= limits.maxFileSize,
      error: fileSizeMB > limits.maxFileSize ? `File size limit of ${limits.maxFileSize}MB exceeded` : undefined
    };
  } catch (error) {
    console.error('Error checking file size limit:', error);
    return { allowed: false, error: 'Failed to check file size limits' };
  }
}

export function hasFeature(userPlan: string, feature: string): boolean {
  const limits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;
  return limits.features.includes(feature);
}
