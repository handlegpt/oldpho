# OldPho 系统改进路线图

## 🎯 基于用户评价的改进计划

### P0 — 成本与速率风控 (最高优先级)

#### 问题分析
- 完全依赖 Replicate API
- 免费额度用完后易触发 429 错误
- 并发高时费用不可控
- 缺少 fallback 机制

#### 解决方案

##### 1. 多模型 Fallback 机制
```typescript
// utils/modelFallback.ts
interface ModelProvider {
  name: string;
  apiKey: string;
  endpoint: string;
  costPerRequest: number;
  rateLimit: number;
}

class ModelFallbackManager {
  private providers: ModelProvider[] = [
    { name: 'replicate', apiKey: process.env.REPLICATE_API_KEY, endpoint: 'replicate', costPerRequest: 0.01, rateLimit: 100 },
    { name: 'openai', apiKey: process.env.OPENAI_API_KEY, endpoint: 'openai', costPerRequest: 0.02, rateLimit: 50 },
    { name: 'local', apiKey: null, endpoint: 'local', costPerRequest: 0, rateLimit: 1000 }
  ];

  async processWithFallback(image: Buffer): Promise<string> {
    for (const provider of this.providers) {
      try {
        return await this.processWithProvider(provider, image);
      } catch (error) {
        console.warn(`Provider ${provider.name} failed:`, error);
        continue;
      }
    }
    throw new Error('All providers failed');
  }
}
```

##### 2. 智能缓存策略
```typescript
// utils/smartCache.ts
class SmartCacheManager {
  private cache = new Map<string, { result: any; timestamp: number; ttl: number }>();
  
  async getOrProcess(key: string, processor: () => Promise<any>, ttl: number = 3600000): Promise<any> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.result;
    }
    
    const result = await processor();
    this.cache.set(key, { result, timestamp: Date.now(), ttl });
    return result;
  }
}
```

##### 3. 队列限流系统
```typescript
// utils/queueManager.ts
class QueueManager {
  private queue: Array<{ id: string; task: () => Promise<any>; priority: number }> = [];
  private processing = false;
  private maxConcurrent = 3;
  private currentConcurrent = 0;

  async addToQueue(task: () => Promise<any>, priority: number = 1): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ id: Date.now().toString(), task, priority });
      this.queue.sort((a, b) => b.priority - a.priority);
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.currentConcurrent >= this.maxConcurrent) return;
    
    this.processing = true;
    while (this.queue.length > 0 && this.currentConcurrent < this.maxConcurrent) {
      const item = this.queue.shift();
      if (item) {
        this.currentConcurrent++;
        item.task().finally(() => {
          this.currentConcurrent--;
          this.processQueue();
        });
      }
    }
    this.processing = false;
  }
}
```

### P1 — 单元 & E2E 测试缺失

#### 解决方案

##### 1. Jest 单元测试配置
```json
// package.json 添加
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "@testing-library/react": "^13.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0"
  }
}
```

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts'
  ]
};
```

##### 2. Playwright E2E 测试
```typescript
// tests/e2e/photo-restoration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Photo Restoration Flow', () => {
  test('should upload and restore photo', async ({ page }) => {
    await page.goto('/restore');
    
    // Upload image
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('input[type="file"]');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/fixtures/test-image.jpg');
    
    // Wait for processing
    await expect(page.locator('.progress-bar')).toBeVisible();
    await expect(page.locator('.result-image')).toBeVisible({ timeout: 30000 });
    
    // Verify result
    await expect(page.locator('.download-button')).toBeEnabled();
  });
});
```

### P1 — NSFW 模型体积优化

#### 解决方案

##### 1. ONNX + WebGPU 替代方案
```typescript
// utils/nsfwCheckOptimized.ts
import { InferenceSession, Tensor } from 'onnxruntime-web';

class OptimizedNSFWPredictor {
  private session: InferenceSession | null = null;
  
  async loadModel() {
    // 使用更小的 ONNX 模型
    this.session = await InferenceSession.create('/models/nsfw-model.onnx', {
      executionProviders: ['webgpu']
    });
  }
  
  async predict(imageData: ImageData): Promise<number[]> {
    if (!this.session) throw new Error('Model not loaded');
    
    const tensor = new Tensor('float32', imageData.data, [1, 3, 224, 224]);
    const results = await this.session.run({ input: tensor });
    return Array.from(results.output.data);
  }
}
```

##### 2. WebAssembly SIMD 优化
```typescript
// utils/nsfwWasm.ts
class WASMNSFWPredictor {
  private wasmModule: any = null;
  
  async loadModel() {
    // 使用编译的 WASM 模块
    this.wasmModule = await import('/models/nsfw-model.wasm');
  }
  
  async predict(imageData: ImageData): Promise<number[]> {
    if (!this.wasmModule) throw new Error('Model not loaded');
    return this.wasmModule.predict(imageData.data);
  }
}
```

### P2 — UI/UX 改进

#### 解决方案

##### 1. 示例图片和对照滑块
```typescript
// components/BeforeAfterSlider.tsx
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  alt: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  alt
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <ReactCompareSlider
        itemOne={<ReactCompareSliderImage src={beforeImage} alt={`${alt} - Before`} />}
        itemTwo={<ReactCompareSliderImage src={afterImage} alt={`${alt} - After`} />}
        className="rounded-lg shadow-lg"
      />
    </div>
  );
};
```

##### 2. 增强进度条动画
```typescript
// components/EnhancedProgressBar.tsx
interface EnhancedProgressBarProps {
  progress: number;
  status: string;
  estimatedTime?: number;
}

export const EnhancedProgressBar: React.FC<EnhancedProgressBarProps> = ({
  progress,
  status,
  estimatedTime
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>{status}</span>
        <span>{progress}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="h-full bg-white opacity-20 animate-pulse"></div>
        </div>
      </div>
      
      {estimatedTime && (
        <div className="text-xs text-gray-500 mt-1 text-center">
          预计剩余时间: {Math.ceil(estimatedTime / 1000)}秒
        </div>
      )}
    </div>
  );
};
```

##### 3. 移动端优化
```css
/* styles/mobile-optimization.css */
@media (max-width: 768px) {
  .mobile-optimized {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
  
  .mobile-button {
    min-height: 44px;
    min-width: 44px;
    padding: 12px 16px;
  }
  
  .mobile-gesture {
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }
}
```

### P2 — 数据合规改进

#### 解决方案

##### 1. S3 临时 URL + TTL 删除脚本
```typescript
// utils/s3Manager.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class S3Manager {
  private client: S3Client;
  private bucket: string;
  
  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });
    this.bucket = process.env.AWS_S3_BUCKET!;
  }
  
  async uploadWithTTL(file: Buffer, key: string, ttlHours: number = 24): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: 'image/jpeg',
      Expires: new Date(Date.now() + ttlHours * 60 * 60 * 1000)
    });
    
    await this.client.send(command);
    
    // 生成预签名 URL
    const urlCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key
    });
    
    return await getSignedUrl(this.client, urlCommand, { expiresIn: ttlHours * 3600 });
  }
  
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key
    });
    
    await this.client.send(command);
  }
}
```

##### 2. 自动删除脚本
```typescript
// scripts/cleanupExpiredFiles.ts
import { S3Manager } from '../utils/s3Manager';
import { prisma } from '../lib/prismadb';

async function cleanupExpiredFiles() {
  const s3Manager = new S3Manager();
  
  // 查找过期的文件记录
  const expiredFiles = await prisma.file.findMany({
    where: {
      createdAt: {
        lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24小时前
      }
    }
  });
  
  for (const file of expiredFiles) {
    try {
      await s3Manager.deleteFile(file.s3Key);
      await prisma.file.delete({ where: { id: file.id } });
      console.log(`Deleted expired file: ${file.s3Key}`);
    } catch (error) {
      console.error(`Failed to delete file ${file.s3Key}:`, error);
    }
  }
}

// 每小时运行一次
setInterval(cleanupExpiredFiles, 60 * 60 * 1000);
```

##### 3. 数据删除策略
```typescript
// utils/dataRetention.ts
class DataRetentionManager {
  async deleteUserData(userId: string): Promise<void> {
    // 删除用户上传的文件
    const userFiles = await prisma.file.findMany({
      where: { userId }
    });
    
    for (const file of userFiles) {
      await this.deleteFile(file.s3Key);
    }
    
    // 删除用户记录
    await prisma.user.delete({
      where: { id: userId }
    });
  }
  
  async deleteExpiredData(): Promise<void> {
    const retentionDays = parseInt(process.env.DATA_RETENTION_DAYS || '7');
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    
    const expiredFiles = await prisma.file.findMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    });
    
    for (const file of expiredFiles) {
      await this.deleteFile(file.s3Key);
      await prisma.file.delete({ where: { id: file.id } });
    }
  }
}
```

## 📋 实施计划

### 第一阶段 (1-2周)
1. 实现多模型 Fallback 机制
2. 添加 Jest 单元测试
3. 优化 NSFW 模型加载

### 第二阶段 (2-3周)
1. 实现智能缓存策略
2. 添加队列限流系统
3. 创建示例图片和对照滑块

### 第三阶段 (3-4周)
1. 实现 S3 临时 URL + TTL 删除
2. 添加 Playwright E2E 测试
3. 移动端优化

### 第四阶段 (4-5周)
1. 数据合规完善
2. 性能监控增强
3. 用户体验优化

## 🎯 预期效果

### 成本控制
- 多模型 fallback 减少 API 依赖
- 智能缓存降低重复请求
- 队列限流控制并发成本

### 测试覆盖
- 单元测试覆盖率达到 80%+
- E2E 测试覆盖主要用户流程
- 自动化测试减少人工测试

### 性能优化
- NSFW 模型加载时间减少 50%
- 移动端响应时间优化
- 用户体验显著提升

### 数据合规
- 自动数据删除机制
- 临时 URL 安全访问
- 完整的隐私保护策略

---

**注意**: 这个改进计划基于用户评价，优先级按照 P0 > P1 > P2 排序，建议按阶段逐步实施。 