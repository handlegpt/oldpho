# Shin AI 设置指南

## 🚀 快速开始

### 1. 环境变量配置

创建 `.env.local` 文件并配置以下变量：

```bash
# 复制示例文件
cp .example.env .env.local
```

#### 必需配置

```bash
# NextAuth 配置 (必需)
NEXTAUTH_URL=http://localhost:3001  # 开发环境
# NEXTAUTH_URL=https://yourdomain.com  # 生产环境
NEXTAUTH_SECRET=your-secret-key-here

# AI API Keys (至少需要一个)
REPLICATE_API_KEY=your-replicate-api-key
# 或者
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
```

#### 可选配置

```bash
# Google OAuth (用于用户登录)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# 邮箱登录 (支持邮箱魔法链接登录)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASS=your-app-password
EMAIL_FROM="Shin AI <hello@shinai.com>"

# 数据库配置 (Docker 自动设置)
POSTGRES_PASSWORD=oldpho_password_2024
DATABASE_URL=postgresql://postgres:oldpho_password_2024@db:5432/oldpho

# Redis 配置 (可选，用于速率限制)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# 分析配置 (可选)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

### 2. 获取 API Keys

#### Replicate API Key
1. 访问 [Replicate](https://replicate.com)
2. 注册账户并获取 API Key
3. 添加到 `REPLICATE_API_KEY`

#### Google Gemini API Key
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建 API Key
3. 添加到 `GOOGLE_GEMINI_API_KEY`

#### Google OAuth (可选)
1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建 OAuth 2.0 客户端 ID
3. 添加授权重定向 URI: `http://localhost:3001/api/auth/callback/google`
4. 添加到 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`

#### 邮箱配置 (可选)
1. 使用 Gmail 应用密码
2. 或配置其他 SMTP 服务器
3. 添加到邮箱相关环境变量

### 3. 运行应用

#### 开发环境
```bash
npm install
npm run dev
```

#### 生产环境 (Docker)
```bash
docker-compose up -d
```

### 4. 健康检查

访问以下 URL 检查服务状态：
- 应用健康检查: `http://localhost:3001/api/health`
- 详细配置检查: `http://localhost:3001/api/health/check`

## 🔧 故障排除

### 常见问题

#### 1. Service Worker 缓存错误
- 清除浏览器缓存
- 检查网络连接
- 确保静态资源路径正确

#### 2. NextAuth 500 错误
- 检查 `NEXTAUTH_SECRET` 是否设置
- 验证 `NEXTAUTH_URL` 是否正确
- 检查邮箱配置（如果使用邮箱登录）

#### 3. 数据库连接错误
- 确保 PostgreSQL 服务运行
- 检查 `DATABASE_URL` 配置
- 运行数据库迁移: `npx prisma migrate deploy`

#### 4. AI API 错误
- 验证 API Key 是否有效
- 检查 API 配额和限制
- 确保网络可以访问 API 服务

### 调试模式

启用调试模式查看详细日志：

```bash
NODE_ENV=development npm run dev
```

### 日志查看

#### Docker 环境
```bash
docker-compose logs -f app
```

#### 开发环境
查看控制台输出和网络请求。

## 📱 移动端优化

应用已针对移动端进行优化：
- 响应式设计
- PWA 支持
- 触摸友好的交互
- 离线功能

## 🔒 安全配置

### 生产环境安全清单

- [ ] 设置强密码的 `NEXTAUTH_SECRET`
- [ ] 配置正确的 `NEXTAUTH_URL`
- [ ] 启用 HTTPS
- [ ] 配置防火墙规则
- [ ] 定期更新依赖
- [ ] 监控日志和错误

### 环境变量安全

- 不要将 `.env.local` 提交到版本控制
- 使用强密码和随机密钥
- 定期轮换 API Keys
- 限制 API Key 权限

## 📊 监控和分析

### 性能监控
- 使用浏览器开发者工具
- 监控 Core Web Vitals
- 检查 Service Worker 状态

### 错误监控
- 查看应用日志
- 监控 API 错误率
- 设置告警通知

## 🆘 获取帮助

如果遇到问题：
1. 检查本文档的故障排除部分
2. 查看应用日志
3. 访问健康检查端点
4. 联系技术支持

---

**注意**: 确保在生产环境中使用强密码和安全的配置。

