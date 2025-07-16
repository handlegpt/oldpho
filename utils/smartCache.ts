// 缓存项接口
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  cost: number;
}

// 缓存统计接口
interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  totalCost: number;
  averageAccessTime: number;
}

// 缓存策略枚举
enum CacheStrategy {
  LRU = 'lru',      // 最近最少使用
  LFU = 'lfu',      // 最少使用频率
  FIFO = 'fifo',    // 先进先出
  COST = 'cost'     // 基于成本
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

  // 设置缓存项
  set<T>(key: string, data: T, ttl: number = 3600000, cost: number = 0): void {
    // 清理过期项目
    this.cleanup();

    // 如果缓存已满，根据策略删除项目
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

  // 获取缓存项
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.totalMisses++;
      return null;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.totalMisses++;
      return null;
    }

    // 更新访问统计
    item.accessCount++;
    item.lastAccessed = Date.now();
    this.totalHits++;
    this.accessTimes.push(Date.now());

    // 保持访问时间数组在合理大小
    if (this.accessTimes.length > 1000) {
      this.accessTimes = this.accessTimes.slice(-500);
    }

    return item.data as T;
  }

  // 获取或处理（如果不存在）
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

    // 处理并缓存结果
    const result = await processor();
    this.set(key, result, ttl, cost);
    return result;
  }

  // 检查是否存在
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // 删除缓存项
  delete(key: string): boolean {
    const item = this.cache.get(key);
    if (item) {
      this.totalCost -= item.cost;
    }
    return this.cache.delete(key);
  }

  // 清理过期项目
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

  // 根据策略删除项目
  private evictItem(): void {
    if (this.cache.size === 0) return;

    let keyToEvict: string | null = null;
    let minValue: number = Infinity;

    switch (this.strategy) {
      case CacheStrategy.LRU:
        // 最近最少使用
        const lruEntries = Array.from(this.cache.entries());
        for (const [key, item] of lruEntries) {
          if (item.lastAccessed < minValue) {
            minValue = item.lastAccessed;
            keyToEvict = key;
          }
        }
        break;

      case CacheStrategy.LFU:
        // 最少使用频率
        const lfuEntries = Array.from(this.cache.entries());
        for (const [key, item] of lfuEntries) {
          if (item.accessCount < minValue) {
            minValue = item.accessCount;
            keyToEvict = key;
          }
        }
        break;

      case CacheStrategy.FIFO:
        // 先进先出
        const keys = Array.from(this.cache.keys());
        keyToEvict = keys[0];
        break;

      case CacheStrategy.COST:
        // 基于成本
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

  // 清空缓存
  clear(): void {
    this.cache.clear();
    this.totalHits = 0;
    this.totalMisses = 0;
    this.totalCost = 0;
    this.accessTimes = [];
  }

  // 获取缓存大小
  size(): number {
    this.cleanup();
    return this.cache.size;
  }

  // 获取缓存统计
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

  // 获取缓存键列表
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // 设置最大大小
  setMaxSize(maxSize: number): void {
    this.maxSize = maxSize;
    
    // 如果当前大小超过新的最大大小，删除多余的项目
    while (this.cache.size > this.maxSize) {
      this.evictItem();
    }
  }

  // 设置缓存策略
  setStrategy(strategy: CacheStrategy): void {
    this.strategy = strategy;
  }

  // 预热缓存
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

  // 批量获取
  async getMultiple<T>(keys: string[]): Promise<Map<string, T | null>> {
    const results = new Map<string, T | null>();
    
    for (const key of keys) {
      results.set(key, this.get<T>(key));
    }
    
    return results;
  }

  // 批量设置
  setMultiple<T>(items: Array<{ key: string; data: T; ttl?: number; cost?: number }>): void {
    for (const item of items) {
      this.set(item.key, item.data, item.ttl || 3600000, item.cost || 0);
    }
  }

  // 获取缓存项详情
  getItemDetails(key: string): CacheItem<any> | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    return item;
  }

  // 导出缓存数据（用于持久化）
  export(): Record<string, CacheItem<any>> {
    const data: Record<string, CacheItem<any>> = {};
    
    const entries = Array.from(this.cache.entries());
    for (const [key, item] of entries) {
      // 只导出未过期的项目
      if (Date.now() - item.timestamp <= item.ttl) {
        data[key] = item;
      }
    }
    
    return data;
  }

  // 导入缓存数据
  import(data: Record<string, CacheItem<any>>): void {
    this.clear();
    
    for (const [key, item] of Object.entries(data)) {
      // 只导入未过期的项目
      if (Date.now() - item.timestamp <= item.ttl) {
        this.cache.set(key, item);
      }
    }
  }
}

// 导出单例实例
export default new SmartCacheManager();

// 导出类型和枚举
export { CacheStrategy, type CacheItem, type CacheStats }; 