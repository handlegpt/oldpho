# OldPho 环境变量配置指南

## 🔧 必需配置

### 1. Replicate API Key
```bash
REPLICATE_API_KEY=your_replicate_api_key_here
```
- 获取地址：https://replicate.com/account/api-tokens
- 用于 AI 照片修复功能

### 2. NextAuth 配置
```bash
# 开发环境
NEXTAUTH_URL=http://localhost:3001

# 生产环境（使用您的域名）
NEXTAUTH_URL=https://yourdomain.com

NEXTAUTH_SECRET=your_generated_secret_here
```
- 生成 NEXTAUTH_SECRET：
  ```bash
  openssl rand -base64 32
  ```
- 或使用在线生成器：https://generate-secret.vercel.app/32

## 🔧 可选配置

### 3. Google OAuth (用户登录)
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
- 获取地址：https://console.cloud.google.com/apis/credentials
- 重定向 URI：
  - 开发环境：`http://localhost:3001/api/auth/callback/google`
  - 生产环境：`https://yourdomain.com/api/auth/callback/google`

### 4. 邮箱登录配置
```bash
# SMTP服务器配置
EMAIL_SERVER=smtp://username:password@smtp.gmail.com:587
EMAIL_FROM="OldPho <noreply@yourdomain.com>"

# 或使用其他SMTP服务
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM="OldPho <noreply@oldpho.com>"
```

### 5. Redis 配置 (速率限制)
```bash
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```
- 获取地址：https://upstash.com/
- 用于用户速率限制和缓存

### 6. 上传配置
```bash
NEXT_PUBLIC_UPLOAD_API_KEY=your_bytescale_api_key
```
- 获取地址：https://www.bytescale.com/
- 用于图片上传功能

## 🚀 快速设置

### 方法 1: 使用 Docker Compose (推荐)
```bash
# 1. 复制环境变量文件
cp .example.env .env

# 2. 编辑 .env 文件，填入必要的配置
nano .env

# 3. 启动应用
docker-compose up -d
```

### 方法 2: 本地开发
```bash
# 1. 安装依赖
npm install

# 2. 设置环境变量
cp .example.env .env.local

# 3. 编辑 .env.local 文件
nano .env.local

# 4. 启动开发服务器
npm run dev
```

## 📋 完整配置示例

```bash
# Replicate API Key (必需)
REPLICATE_API_KEY=r8_your_replicate_api_key_here

# NextAuth 配置 (必需)
NEXTAUTH_URL=http://localhost:3001  # 开发环境
# NEXTAUTH_URL=https://yourdomain.com  # 生产环境
NEXTAUTH_SECRET=your_generated_secret_here

# Google OAuth (可选)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# 邮箱登录配置 (可选)
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM="OldPho <noreply@oldpho.com>"

# 数据库配置 (Docker 自动设置)
POSTGRES_PASSWORD=oldpho_password_2024
DATABASE_URL=postgresql://postgres:oldpho_password_2024@db:5432/oldpho
SHADOW_DATABASE_URL=postgresql://postgres:oldpho_password_2024@db:5432/oldpho_shadow

# Redis 配置 (可选)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# 上传配置 (可选)
NEXT_PUBLIC_UPLOAD_API_KEY=your_bytescale_api_key

# 应用配置
NODE_ENV=development
PORT=3001

# 分析配置 (可选)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=oldpho.com
```

## 🔍 配置验证

### 检查必需配置
```bash
# 验证环境变量
node -e "
const required = ['REPLICATE_API_KEY', 'NEXTAUTH_SECRET'];
const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.log('❌ 缺少必需配置:', missing);
  process.exit(1);
} else {
  console.log('✅ 所有必需配置已设置');
}
"
```

### 测试 API 连接
```bash
# 测试 Replicate API
curl -H "Authorization: Token $REPLICATE_API_KEY" \
  https://api.replicate.com/v1/models

# 测试 Redis 连接 (如果配置了)
curl -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
  "$UPSTASH_REDIS_REST_URL/get/test"
```

## 🛠️ 故障排除

### 常见问题

1. **NEXTAUTH_SECRET 错误**
   ```bash
   # 重新生成密钥
   openssl rand -base64 32
   ```

2. **Google OAuth 错误**
   - 检查重定向 URI 是否正确
   - 确保域名匹配
   - 验证 NEXTAUTH_URL 设置

3. **邮箱登录错误**
   - 检查 EMAIL_SERVER 和 EMAIL_FROM 配置
   - 验证 SMTP 服务器设置
   - 确保邮箱地址格式正确

4. **Redis 连接错误**
   - 检查 URL 和 Token 格式
   - 验证网络连接

5. **上传功能错误**
   - 检查 Bytescale API Key
   - 验证域名配置

## 📚 相关链接

- [Replicate API 文档](https://replicate.com/docs)
- [NextAuth.js 文档](https://next-auth.js.org/)
- [Google OAuth 设置](https://developers.google.com/identity/protocols/oauth2)
- [Upstash Redis 文档](https://docs.upstash.com/redis)
- [Bytescale 文档](https://www.bytescale.com/docs)

---

**注意**: 请确保将敏感信息（如 API 密钥）保存在 `.env` 文件中，并添加到 `.gitignore` 中。 