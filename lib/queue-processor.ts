import { photoRestorationQueue, JOB_STATUS, QueueJob } from './redis';
import { replicate } from './replicate';

// Queue processor class
export class QueueProcessor {
  private isRunning: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;
  private checkInterval: number = 5000; // Check every 5 seconds

  constructor() {
    this.start();
  }

  // Start the processor
  start(): void {
    if (this.isRunning) {
      console.log('Queue processor is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting queue processor...');

    this.processingInterval = setInterval(async () => {
      await this.processNextJob();
    }, this.checkInterval);
  }

  // Stop the processor
  stop(): void {
    if (!this.isRunning) {
      console.log('Queue processor is not running');
      return;
    }

    this.isRunning = false;
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    console.log('Queue processor stopped');
  }

  // Process next job from queue
  private async processNextJob(): Promise<void> {
    try {
      const job = await photoRestorationQueue.getNextJob();
      if (!job) {
        return; // No jobs available
      }

      console.log(`Processing job ${job.id} for user ${job.userId}`);
      await this.processJob(job);
    } catch (error) {
      console.error('Error processing job:', error);
    }
  }

  // Process individual job
  private async processJob(job: QueueJob): Promise<void> {
    const startTime = Date.now();

    try {
      // Call Replicate API for photo restoration
      const result = await replicate.run(
        "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
        {
          input: {
            img: job.imageUrl,
            version: "v1.4",
            scale: 2
          }
        }
      );

      const processingTime = Date.now() - startTime;

      // Update job with success result
      await photoRestorationQueue.updateJobStatus(job.id, JOB_STATUS.COMPLETED, {
        restoredImageUrl: result as string,
        processingTime,
      });

      console.log(`Job ${job.id} completed successfully in ${processingTime}ms`);

      // TODO: Send notification to user (email, websocket, etc.)
      await this.notifyUser(job, 'completed', result as string);

    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      console.error(`Job ${job.id} failed:`, errorMessage);

      // Update job with error
      await photoRestorationQueue.updateJobStatus(job.id, JOB_STATUS.FAILED, undefined, errorMessage);

      // TODO: Send notification to user about failure
      await this.notifyUser(job, 'failed', undefined, errorMessage);
    }
  }

  // Notify user about job status
  private async notifyUser(
    job: QueueJob, 
    status: 'completed' | 'failed', 
    resultUrl?: string, 
    error?: string
  ): Promise<void> {
    // TODO: Implement user notification
    // This could be:
    // - Email notification
    // - WebSocket notification
    // - Push notification
    // - In-app notification

    console.log(`Notifying user ${job.userEmail} about job ${job.id} status: ${status}`);
    
    if (status === 'completed' && resultUrl) {
      console.log(`Job completed successfully. Result URL: ${resultUrl}`);
    } else if (status === 'failed' && error) {
      console.log(`Job failed with error: ${error}`);
    }
  }

  // Get processor status
  getStatus(): { isRunning: boolean; checkInterval: number } {
    return {
      isRunning: this.isRunning,
      checkInterval: this.checkInterval,
    };
  }

  // Set check interval
  setCheckInterval(interval: number): void {
    this.checkInterval = interval;
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = setInterval(async () => {
        await this.processNextJob();
      }, this.checkInterval);
    }
  }
}

// Export singleton instance
export const queueProcessor = new QueueProcessor();

// Auto-start processor when module is loaded
if (typeof window === 'undefined') {
  // Only start on server side
  queueProcessor.start();
} 