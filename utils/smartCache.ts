// Cache item interface
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  cost: number;
}

// Cache statistics interface
interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  totalCost: number;
  averageAccessTime: number;
}

// Cache strategy enum
enum CacheStrategy {
  LRU = 'lru',      // Least Recently Used
  LFU = 'lfu',      // Least Frequently Used
  FIFO = 'fifo',    // First In First Out
  COST = 'cost'     // Cost-based
}

class SmartCacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize: number;
  private strategy: CacheStrategy;
  private totalHits = 0;
  private totalMisses = 0;
  private totalCost = 0;
  private accessTimes: number[] = [];

  constructor(maxSize: number = 100, strategy: CacheStrategy = CacheStrategy.LRU) {
    this.maxSize = maxSize;
    this.strategy = strategy;
  }

  // Set cache item
  set<T>(key: string, data: T, ttl: number = 3600000, cost: number = 0): void {
    // Clean up expired items
    this.cleanup();

    // If cache is full, evict items based on strategy
    if (this.cache.size >= this.maxSize) {
      this.evictItem();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
      cost
    });
  }

  // Get cache item
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.totalMisses++;
      return null;
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.totalMisses++;
      return null;
    }

    // Update access statistics
    item.accessCount++;
    item.lastAccessed = Date.now();
    this.totalHits++;
    this.accessTimes.push(Date.now());

    // Keep access times array at reasonable size
    if (this.accessTimes.length > 1000) {
      this.accessTimes = this.accessTimes.slice(-500);
    }

    return item.data as T;
  }

  // Get or process (if not exists)
  async getOrProcess<T>(
    key: string, 
    processor: () => Promise<T>, 
    ttl: number = 3600000,
    cost: number = 0
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Process and cache result
    const result = await processor();
    this.set(key, result, ttl, cost);
    return result;
  }

  // Check if exists
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Delete cache item
  delete(key: string): boolean {
    const item = this.cache.get(key);
    if (item) {
      this.totalCost -= item.cost;
    }
    return this.cache.delete(key);
  }

  // Clean up expired items
  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    for (const [key, item] of entries) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        this.totalCost -= item.cost;
      }
    }
  }

  // Evict item based on strategy
  private evictItem(): void {
    if (this.cache.size === 0) return;

    let keyToEvict: string | null = null;
    let minValue: number = Infinity;

    switch (this.strategy) {
      case CacheStrategy.LRU:
        // Least Recently Used
        const lruEntries = Array.from(this.cache.entries());
        for (const [key, item] of lruEntries) {
          if (item.lastAccessed < minValue) {
            minValue = item.lastAccessed;
            keyToEvict = key;
          }
        }
        break;

      case CacheStrategy.LFU:
        // Least Frequently Used
        const lfuEntries = Array.from(this.cache.entries());
        for (const [key, item] of lfuEntries) {
          if (item.accessCount < minValue) {
            minValue = item.accessCount;
            keyToEvict = key;
          }
        }
        break;

      case CacheStrategy.FIFO:
        // First In First Out
        const keys = Array.from(this.cache.keys());
        keyToEvict = keys[0];
        break;

      case CacheStrategy.COST:
        // Cost-based
        const costEntries = Array.from(this.cache.entries());
        for (const [key, item] of costEntries) {
          if (item.cost > minValue) {
            minValue = item.cost;
            keyToEvict = key;
          }
        }
        break;
    }

    if (keyToEvict) {
      this.delete(keyToEvict);
    }
  }

  // Clear cache
  clear(): void {
    this.cache.clear();
    this.totalHits = 0;
    this.totalMisses = 0;
    this.totalCost = 0;
    this.accessTimes = [];
  }

  // Get cache size
  size(): number {
    this.cleanup();
    return this.cache.size;
  }

  // Get cache statistics
  getStats(): CacheStats {
    this.cleanup();
    
    const totalRequests = this.totalHits + this.totalMisses;
    const hitRate = totalRequests > 0 ? (this.totalHits / totalRequests) * 100 : 0;
    
    const averageAccessTime = this.accessTimes.length > 0 
      ? this.accessTimes.reduce((sum, time) => sum + time, 0) / this.accessTimes.length
      : 0;

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate,
      totalHits: this.totalHits,
      totalMisses: this.totalMisses,
      totalCost: this.totalCost,
      averageAccessTime
    };
  }

  // Get cache keys list
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Set max size
  setMaxSize(maxSize: number): void {
    this.maxSize = maxSize;
    
    // If current size exceeds new max size, delete excess items
    while (this.cache.size > this.maxSize) {
      this.evictItem();
    }
  }

  // Set cache strategy
  setStrategy(strategy: CacheStrategy): void {
    this.strategy = strategy;
  }

  // Warm up cache
  async warmup<T>(items: Array<{ key: string; processor: () => Promise<T>; ttl?: number; cost?: number }>): Promise<void> {
    const promises = items.map(item => 
      this.getOrProcess(
        item.key, 
        item.processor, 
        item.ttl || 3600000,
        item.cost || 0
      )
    );
    
    await Promise.all(promises);
  }

  // Batch get
  async getMultiple<T>(keys: string[]): Promise<Map<string, T | null>> {
    const results = new Map<string, T | null>();
    
    for (const key of keys) {
      results.set(key, this.get<T>(key));
    }
    
    return results;
  }

  // Batch set
  setMultiple<T>(items: Array<{ key: string; data: T; ttl?: number; cost?: number }>): void {
    for (const item of items) {
      this.set(item.key, item.data, item.ttl || 3600000, item.cost || 0);
    }
  }

  // Get cache item details
  getItemDetails(key: string): CacheItem<any> | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    return item;
  }

  // Export cache data (for persistence)
  export(): Record<string, CacheItem<any>> {
    const data: Record<string, CacheItem<any>> = {};
    
    const entries = Array.from(this.cache.entries());
    for (const [key, item] of entries) {
      // Only export non-expired items
      if (Date.now() - item.timestamp <= item.ttl) {
        data[key] = item;
      }
    }
    
    return data;
  }

  // Import cache data
  import(data: Record<string, CacheItem<any>>): void {
    this.clear();
    
    for (const [key, item] of Object.entries(data)) {
      // Only import non-expired items
      if (Date.now() - item.timestamp <= item.ttl) {
        this.cache.set(key, item);
      }
    }
  }
}

// Export singleton instance
export default new SmartCacheManager();

// Export types and enum
export { CacheStrategy, type CacheItem, type CacheStats }; 