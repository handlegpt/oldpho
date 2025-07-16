import { Redis } from '@upstash/redis';

// In-memory queue as fallback
class MemoryQueue {
  private jobs: Map<string, QueueJob> = new Map();
  private highPriorityQueue: string[] = [];
  private lowPriorityQueue: string[] = [];
  private processingJobs: Set<string> = new Set();

  async addJob(job: Omit<QueueJob, 'id' | 'status' | 'createdAt' | 'retryCount'>): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullJob: QueueJob = {
      ...job,
      id: jobId,
      status: JOB_STATUS.PENDING,
      createdAt: Date.now(),
      retryCount: 0,
    };

    this.jobs.set(jobId, fullJob);
    
    if (job.priority === 'high') {
      this.highPriorityQueue.push(jobId);
    } else {
      this.lowPriorityQueue.push(jobId);
    }
    
    console.log(`Job ${jobId} added to memory queue with priority: ${job.priority}`);
    return jobId;
  }

  async getNextJob(): Promise<QueueJob | null> {
    if (this.processingJobs.size >= 5) {
      return null;
    }

    let jobId: string | undefined;
    
    if (this.highPriorityQueue.length > 0) {
      jobId = this.highPriorityQueue.pop();
    } else if (this.lowPriorityQueue.length > 0) {
      jobId = this.lowPriorityQueue.pop();
    }

    if (!jobId) {
      return null;
    }

    const job = this.jobs.get(jobId);
    if (job) {
      job.status = JOB_STATUS.PROCESSING;
      job.startedAt = Date.now();
      this.processingJobs.add(jobId);
      return job;
    }

    return null;
  }

  async updateJobStatus(jobId: string, status: QueueJob['status'], result?: QueueJob['result'], error?: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    job.status = status;
    
    if (status === JOB_STATUS.COMPLETED && result) {
      job.result = result;
      job.completedAt = Date.now();
    } else if (status === JOB_STATUS.FAILED) {
      job.error = error;
      job.completedAt = Date.now();
    }

    this.processingJobs.delete(jobId);
  }

  async getJob(jobId: string): Promise<QueueJob | null> {
    return this.jobs.get(jobId) || null;
  }

  async getUserJobs(userId: string): Promise<QueueJob[]> {
    return Array.from(this.jobs.values())
      .filter(job => job.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async getQueueStats(): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    highPriority: number;
    lowPriority: number;
  }> {
    const jobs = Array.from(this.jobs.values());
    
    return {
      pending: jobs.filter(j => j.status === JOB_STATUS.PENDING).length,
      processing: this.processingJobs.size,
      completed: jobs.filter(j => j.status === JOB_STATUS.COMPLETED).length,
      failed: jobs.filter(j => j.status === JOB_STATUS.FAILED).length,
      highPriority: this.highPriorityQueue.length,
      lowPriority: this.lowPriorityQueue.length,
    };
  }

  async getProcessingCount(): Promise<number> {
    return this.processingJobs.size;
  }

  async cancelJob(jobId: string, userId: string): Promise<boolean> {
    const job = this.jobs.get(jobId);
    if (!job || job.userId !== userId) {
      return false;
    }

    job.status = JOB_STATUS.CANCELLED;
    this.processingJobs.delete(jobId);
    return true;
  }

  async cleanupOldJobs(): Promise<number> {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    let cleaned = 0;

    for (const [jobId, job] of this.jobs.entries()) {
      if (job.createdAt < oneDayAgo && job.status !== JOB_STATUS.PROCESSING) {
        this.jobs.delete(jobId);
        cleaned++;
      }
    }

    return cleaned;
  }
}

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

// Try to initialize Redis, fallback to memory queue
let redisClient: Redis | null = null;
let memoryQueue: MemoryQueue | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log('Redis client initialized successfully');
  } else {
    console.warn('Redis environment variables not found, using memory queue');
    memoryQueue = new MemoryQueue();
  }
} catch (error) {
  console.warn('Failed to initialize Redis, using memory queue:', error);
  memoryQueue = new MemoryQueue();
}

// Queue management class
export class PhotoRestorationQueue {
  private maxConcurrentJobs: number;
  private maxRetries: number;

  constructor(maxConcurrentJobs = 5, maxRetries = 3) {
    this.maxConcurrentJobs = maxConcurrentJobs;
    this.maxRetries = maxRetries;
  }

  // Add job to queue
  async addJob(job: Omit<QueueJob, 'id' | 'status' | 'createdAt' | 'retryCount'>): Promise<string> {
    if (memoryQueue) {
      return memoryQueue.addJob(job);
    }

    if (!redisClient) {
      throw new Error('No queue system available');
    }

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
    
    await redisClient.lpush(queueName, JSON.stringify(fullJob));
    await redisClient.hset(`job:${jobId}`, { data: JSON.stringify(fullJob) });
    
    console.log(`Job ${jobId} added to Redis queue with priority: ${job.priority}`);
    return jobId;
  }

  // Get next job from queue
  async getNextJob(): Promise<QueueJob | null> {
    if (memoryQueue) {
      return memoryQueue.getNextJob();
    }

    if (!redisClient) {
      throw new Error('No queue system available');
    }

    // Check if we can process more jobs
    const processingCount = await this.getProcessingCount();
    if (processingCount >= this.maxConcurrentJobs) {
      return null;
    }

    // Try high priority queue first, then low priority
    const highPriorityJob = await redisClient.rpop(QUEUE_NAMES.HIGH_PRIORITY);
    if (highPriorityJob) {
      const job: QueueJob = JSON.parse(highPriorityJob);
      job.status = JOB_STATUS.PROCESSING;
      job.startedAt = Date.now();
      await redisClient.hset(`job:${job.id}`, { data: JSON.stringify(job) });
      return job;
    }

    const lowPriorityJob = await redisClient.rpop(QUEUE_NAMES.LOW_PRIORITY);
    if (lowPriorityJob) {
      const job: QueueJob = JSON.parse(lowPriorityJob);
      job.status = JOB_STATUS.PROCESSING;
      job.startedAt = Date.now();
      await redisClient.hset(`job:${job.id}`, { data: JSON.stringify(job) });
      return job;
    }

    return null;
  }

  // Update job status
  async updateJobStatus(jobId: string, status: QueueJob['status'], result?: QueueJob['result'], error?: string): Promise<void> {
    if (memoryQueue) {
      return memoryQueue.updateJobStatus(jobId, status, result, error);
    }

    if (!redisClient) {
      throw new Error('No queue system available');
    }

    const jobData = await redisClient.hgetall(`job:${jobId}`);
    if (!jobData || Object.keys(jobData).length === 0) {
      throw new Error(`Job ${jobId} not found`);
    }

    const jobString = jobData.data as string;
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
        await redisClient.lpush(queueName, JSON.stringify(job));
      } else {
        // Move to failed jobs queue
        await redisClient.lpush(QUEUE_NAMES.FAILED_JOBS, JSON.stringify(job));
      }
    }

    await redisClient.hset(`job:${jobId}`, { data: JSON.stringify(job) });
  }

  // Get job by ID
  async getJob(jobId: string): Promise<QueueJob | null> {
    if (memoryQueue) {
      return memoryQueue.getJob(jobId);
    }

    if (!redisClient) {
      throw new Error('No queue system available');
    }

    const jobData = await redisClient.hgetall(`job:${jobId}`);
    if (!jobData || Object.keys(jobData).length === 0) {
      return null;
    }
    // Redis hgetall returns an object with our data field
    const jobString = jobData.data as string;
    return jobString ? JSON.parse(jobString) : null;
  }

  // Get user's jobs
  async getUserJobs(userId: string): Promise<QueueJob[]> {
    if (memoryQueue) {
      return memoryQueue.getUserJobs(userId);
    }

    if (!redisClient) {
      throw new Error('No queue system available');
    }

    const pattern = `job:*`;
    const keys = await redisClient.keys(pattern);
    const jobs: QueueJob[] = [];

    for (const key of keys) {
      const jobData = await redisClient.hgetall(key);
      if (jobData && jobData.data) {
        const jobString = jobData.data as string;
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
    if (memoryQueue) {
      return memoryQueue.getQueueStats();
    }

    if (!redisClient) {
      throw new Error('No queue system available');
    }

    const [highPriorityCount, lowPriorityCount] = await Promise.all([
      redisClient.llen(QUEUE_NAMES.HIGH_PRIORITY),
      redisClient.llen(QUEUE_NAMES.LOW_PRIORITY),
    ]);

    const pattern = `job:*`;
    const keys = await redisClient.keys(pattern);
    let processing = 0;
    let completed = 0;
    let failed = 0;

    for (const key of keys) {
      const jobData = await redisClient.hgetall(key);
      if (jobData && jobData.data) {
        const jobString = jobData.data as string;
        if (jobString) {
          const job = JSON.parse(jobString);
          switch (job.status) {
            case JOB_STATUS.PROCESSING:
              processing++;
              break;
            case JOB_STATUS.COMPLETED:
              completed++;
              break;
            case JOB_STATUS.FAILED:
              failed++;
              break;
          }
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
    if (memoryQueue) {
      return memoryQueue.getProcessingCount();
    }

    if (!redisClient) {
      throw new Error('No queue system available');
    }

    const pattern = `job:*`;
    const keys = await redisClient.keys(pattern);
    let processing = 0;

    for (const key of keys) {
      const jobData = await redisClient.hgetall(key);
      if (jobData && jobData.data) {
        const jobString = jobData.data as string;
        if (jobString) {
          const job = JSON.parse(jobString);
          if (job.status === JOB_STATUS.PROCESSING) {
            processing++;
          }
        }
      }
    }

    return processing;
  }

  // Cancel job
  async cancelJob(jobId: string, userId: string): Promise<boolean> {
    if (memoryQueue) {
      return memoryQueue.cancelJob(jobId, userId);
    }

    if (!redisClient) {
      throw new Error('No queue system available');
    }

    const jobData = await redisClient.hgetall(`job:${jobId}`);
    if (!jobData || Object.keys(jobData).length === 0) {
      return false;
    }

    const jobString = jobData.data as string;
    const job: QueueJob = JSON.parse(jobString);
    
    if (job.userId !== userId) {
      return false;
    }

    job.status = JOB_STATUS.CANCELLED;
    await redisClient.hset(`job:${jobId}`, { data: JSON.stringify(job) });
    return true;
  }

  // Cleanup old jobs
  async cleanupOldJobs(): Promise<number> {
    if (memoryQueue) {
      return memoryQueue.cleanupOldJobs();
    }

    if (!redisClient) {
      throw new Error('No queue system available');
    }

    const pattern = `job:*`;
    const keys = await redisClient.keys(pattern);
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    let cleaned = 0;

    for (const key of keys) {
      const jobData = await redisClient.hgetall(key);
      if (jobData && jobData.data) {
        const jobString = jobData.data as string;
        if (jobString) {
          const job = JSON.parse(jobString);
          if (job.createdAt < oneDayAgo && job.status !== JOB_STATUS.PROCESSING) {
            await redisClient.del(key);
            cleaned++;
          }
        }
      }
    }

    return cleaned;
  }
}

// Export singleton instance
export const photoRestorationQueue = new PhotoRestorationQueue(); 