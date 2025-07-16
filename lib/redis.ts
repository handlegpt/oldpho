import { Redis } from '@upstash/redis';

// Redis client configuration
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Queue configuration
const QUEUE_NAMES = {
  PHOTO_RESTORATION: 'photo_restoration_queue',
  HIGH_PRIORITY: 'high_priority_queue',
  LOW_PRIORITY: 'low_priority_queue',
  FAILED_JOBS: 'failed_jobs_queue',
} as const;

// Job status
export const JOB_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

// Job interface
export interface QueueJob {
  id: string;
  userId: string;
  userEmail: string;
  imageUrl: string;
  originalImageUrl: string;
  priority: 'high' | 'normal' | 'low';
  status: typeof JOB_STATUS[keyof typeof JOB_STATUS];
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  error?: string;
  result?: {
    restoredImageUrl: string;
    processingTime: number;
  };
  retryCount: number;
  maxRetries: number;
}

// Queue management class
export class PhotoRestorationQueue {
  private redis: Redis;
  private maxConcurrentJobs: number;
  private maxRetries: number;

  constructor(maxConcurrentJobs = 5, maxRetries = 3) {
    this.redis = redis;
    this.maxConcurrentJobs = maxConcurrentJobs;
    this.maxRetries = maxRetries;
  }

  // Add job to queue
  async addJob(job: Omit<QueueJob, 'id' | 'status' | 'createdAt' | 'retryCount'>): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullJob: QueueJob = {
      ...job,
      id: jobId,
      status: JOB_STATUS.PENDING,
      createdAt: Date.now(),
      retryCount: 0,
    };

    // Add to appropriate queue based on priority
    const queueName = job.priority === 'high' ? QUEUE_NAMES.HIGH_PRIORITY : QUEUE_NAMES.LOW_PRIORITY;
    
    await this.redis.lpush(queueName, JSON.stringify(fullJob));
    await this.redis.hset(`job:${jobId}`, JSON.stringify(fullJob));
    
    console.log(`Job ${jobId} added to queue with priority: ${job.priority}`);
    return jobId;
  }

  // Get next job from queue
  async getNextJob(): Promise<QueueJob | null> {
    // Check if we can process more jobs
    const processingCount = await this.getProcessingCount();
    if (processingCount >= this.maxConcurrentJobs) {
      return null;
    }

    // Try high priority queue first, then low priority
    const highPriorityJob = await this.redis.rpop(QUEUE_NAMES.HIGH_PRIORITY);
    if (highPriorityJob) {
      const job: QueueJob = JSON.parse(highPriorityJob);
      job.status = JOB_STATUS.PROCESSING;
      job.startedAt = Date.now();
      await this.redis.hset(`job:${job.id}`, job);
      return job;
    }

    const lowPriorityJob = await this.redis.rpop(QUEUE_NAMES.LOW_PRIORITY);
    if (lowPriorityJob) {
      const job: QueueJob = JSON.parse(lowPriorityJob);
      job.status = JOB_STATUS.PROCESSING;
      job.startedAt = Date.now();
      await this.redis.hset(`job:${job.id}`, job);
      return job;
    }

    return null;
  }

  // Update job status
  async updateJobStatus(jobId: string, status: QueueJob['status'], result?: QueueJob['result'], error?: string): Promise<void> {
    const jobData = await this.redis.hgetall(`job:${jobId}`);
    if (!jobData || Object.keys(jobData).length === 0) {
      throw new Error(`Job ${jobId} not found`);
    }

    const jobString = Object.values(jobData)[0] as string;
    const job: QueueJob = JSON.parse(jobString);
    job.status = status;
    
    if (status === JOB_STATUS.COMPLETED && result) {
      job.result = result;
      job.completedAt = Date.now();
    } else if (status === JOB_STATUS.FAILED) {
      job.error = error;
      job.completedAt = Date.now();
      
      // Retry logic
      if (job.retryCount < this.maxRetries) {
        job.retryCount++;
        job.status = JOB_STATUS.PENDING;
        job.startedAt = undefined;
        job.completedAt = undefined;
        job.error = undefined;
        
        // Add back to queue
        const queueName = job.priority === 'high' ? QUEUE_NAMES.HIGH_PRIORITY : QUEUE_NAMES.LOW_PRIORITY;
        await this.redis.lpush(queueName, JSON.stringify(job));
      } else {
        // Move to failed jobs queue
        await this.redis.lpush(QUEUE_NAMES.FAILED_JOBS, JSON.stringify(job));
      }
    }

    await this.redis.hset(`job:${jobId}`, JSON.stringify(job));
  }

  // Get job by ID
  async getJob(jobId: string): Promise<QueueJob | null> {
    const jobData = await this.redis.hgetall(`job:${jobId}`);
    if (!jobData || Object.keys(jobData).length === 0) {
      return null;
    }
    // Redis hgetall returns an object, but we stored it as JSON string
    // So we need to get the actual job data from the object
    const jobString = Object.values(jobData)[0] as string;
    return jobString ? JSON.parse(jobString) : null;
  }

  // Get user's jobs
  async getUserJobs(userId: string): Promise<QueueJob[]> {
    const pattern = `job:*`;
    const keys = await this.redis.keys(pattern);
    const jobs: QueueJob[] = [];

    for (const key of keys) {
      const jobData = await this.redis.hgetall(key);
      if (jobData && Object.keys(jobData).length > 0) {
        const jobString = Object.values(jobData)[0] as string;
        if (jobString) {
          const job = JSON.parse(jobString);
          if (job.userId === userId) {
            jobs.push(job);
          }
        }
      }
    }

    return jobs.sort((a, b) => b.createdAt - a.createdAt);
  }

  // Get queue statistics
  async getQueueStats(): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    highPriority: number;
    lowPriority: number;
  }> {
    const [highPriorityCount, lowPriorityCount] = await Promise.all([
      this.redis.llen(QUEUE_NAMES.HIGH_PRIORITY),
      this.redis.llen(QUEUE_NAMES.LOW_PRIORITY),
    ]);

    const pattern = `job:*`;
    const keys = await this.redis.keys(pattern);
    let processing = 0;
    let completed = 0;
    let failed = 0;

    for (const key of keys) {
      const jobData = await this.redis.hgetall(key);
      if (jobData && Object.keys(jobData).length > 0) {
        const jobString = Object.values(jobData)[0] as string;
        if (jobString) {
          const job = JSON.parse(jobString);
          if (job.status === JOB_STATUS.PROCESSING) processing++;
          else if (job.status === JOB_STATUS.COMPLETED) completed++;
          else if (job.status === JOB_STATUS.FAILED) failed++;
        }
      }
    }

    return {
      pending: highPriorityCount + lowPriorityCount,
      processing,
      completed,
      failed,
      highPriority: highPriorityCount,
      lowPriority: lowPriorityCount,
    };
  }

  // Get processing count
  async getProcessingCount(): Promise<number> {
    const pattern = `job:*`;
    const keys = await this.redis.keys(pattern);
    let count = 0;

    for (const key of keys) {
      const jobData = await this.redis.hgetall(key);
      if (jobData && Object.keys(jobData).length > 0) {
        const jobString = Object.values(jobData)[0] as string;
        if (jobString) {
          const job = JSON.parse(jobString);
          if (job.status === JOB_STATUS.PROCESSING) {
            count++;
          }
        }
      }
    }

    return count;
  }

  // Cancel job
  async cancelJob(jobId: string, userId: string): Promise<boolean> {
    const job = await this.getJob(jobId);
    if (!job || job.userId !== userId) {
      return false;
    }

    if (job.status === JOB_STATUS.PENDING) {
      await this.updateJobStatus(jobId, JOB_STATUS.CANCELLED);
      return true;
    }

    return false;
  }

  // Clean up old completed jobs (older than 7 days)
  async cleanupOldJobs(): Promise<number> {
    const pattern = `job:*`;
    const keys = await this.redis.keys(pattern);
    const cutoffTime = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
    let deletedCount = 0;

    for (const key of keys) {
      const jobData = await this.redis.hgetall(key);
      if (jobData && Object.keys(jobData).length > 0) {
        const jobString = Object.values(jobData)[0] as string;
        if (jobString) {
          const job = JSON.parse(jobString);
          if (job.status === JOB_STATUS.COMPLETED && job.completedAt < cutoffTime) {
            await this.redis.del(key);
            deletedCount++;
          }
        }
      }
    }

    return deletedCount;
  }
}

// Export singleton instance
export const photoRestorationQueue = new PhotoRestorationQueue(10);

// Export Redis instance for other uses
export { redis }; 