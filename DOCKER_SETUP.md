# OldPho Docker 安装和部署指南

## 🐳 前置要求

### 1. 安装 Docker
```bash
# macOS (使用 Homebrew)
brew install --cask docker

# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# CentOS/RHEL
sudo yum install docker docker-compose

# Windows
# 下载 Docker Desktop: https://www.docker.com/products/docker-desktop
```

### 2. 启动 Docker 服务
```bash
# macOS/Windows (Docker Desktop 会自动启动)
# Linux
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
docker-compose --version
```

## 🚀 快速部署

### 步骤 1: 克隆项目
```bash
git clone https://github.com/handlegpt/oldpho.git
cd oldpho
```

### 步骤 2: 配置环境变量
```bash
# 复制环境变量模板
cp .example.env .env

# 编辑环境变量文件
nano .env
```

### 步骤 3: 设置必需的环境变量
```bash
# 在 .env 文件中设置以下变量：

# Replicate API Key (必需)
REPLICATE_API_KEY=r8_your_replicate_api_key_here

# NextAuth 配置 (必需)
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_generated_secret_here

# 生成 NEXTAUTH_SECRET
openssl rand -base64 32
```

### 步骤 4: 启动应用
```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app
```

### 步骤 5: 初始化数据库
```bash
# 运行数据库迁移
docker-compose exec app npx prisma migrate deploy

# 生成 Prisma 客户端
docker-compose exec app npx prisma generate
```

## 📋 完整配置示例

```bash
# .env 文件内容示例

# Replicate API Key (必需)
REPLICATE_API_KEY=r8_your_replicate_api_key_here

# NextAuth 配置 (必需)
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_generated_secret_here

# Google OAuth (可选)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

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
NODE_ENV=production
PORT=3001

# 分析配置 (可选)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=oldpho.com
```

## 🔧 Docker 服务说明

### 服务架构
```yaml
services:
  app:          # Next.js 应用
  db:           # PostgreSQL 数据库
  redis:        # Redis 缓存
```

### 端口映射
- **应用**: http://localhost:3001
- **数据库**: localhost:5432
- **Redis**: localhost:6379

## 🛠️ 常用命令

### 启动和停止
```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 重启服务
docker-compose restart

# 查看服务状态
docker-compose ps
```

### 日志管理
```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs app
docker-compose logs db
docker-compose logs redis

# 实时查看日志
docker-compose logs -f app
```

### 数据库操作
```bash
# 进入数据库容器
docker-compose exec db psql -U postgres -d oldpho

# 运行数据库迁移
docker-compose exec app npx prisma migrate deploy

# 重置数据库
docker-compose exec app npx prisma migrate reset

# 查看数据库状态
docker-compose exec app npx prisma studio
```

### 应用维护
```bash
# 进入应用容器
docker-compose exec app sh

# 重新构建应用
docker-compose build app

# 更新依赖
docker-compose exec app npm install

# 清理缓存
docker-compose exec app npm run build
```

## 🔍 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :3001
   lsof -i :5432
   
   # 修改端口映射
   # 在 docker-compose.yml 中修改 ports 配置
   ```

2. **数据库连接错误**
   ```bash
   # 检查数据库状态
   docker-compose logs db
   
   # 重新初始化数据库
   docker-compose down -v
   docker-compose up -d
   ```

3. **应用启动失败**
   ```bash
   # 查看应用日志
   docker-compose logs app
   
   # 检查环境变量
   docker-compose exec app env | grep -E "(REPLICATE|NEXTAUTH)"
   ```

4. **内存不足**
   ```bash
   # 增加 Docker 内存限制
   # 在 Docker Desktop 设置中调整内存限制
   ```

### 性能优化

1. **增加资源限制**
   ```yaml
   # 在 docker-compose.yml 中添加
   deploy:
     resources:
       limits:
         memory: 2G
         cpus: '2'
   ```

2. **启用缓存**
   ```bash
   # 使用 Docker 缓存
   docker-compose build --no-cache
   ```

## 📊 监控和维护

### 健康检查
```bash
# 检查服务健康状态
docker-compose ps

# 查看资源使用情况
docker stats

# 检查磁盘使用情况
docker system df
```

### 备份和恢复
```bash
# 备份数据库
docker-compose exec db pg_dump -U postgres oldpho > backup.sql

# 恢复数据库
docker-compose exec -T db psql -U postgres oldpho < backup.sql
```

### 更新应用
```bash
# 拉取最新代码
git pull

# 重新构建镜像
docker-compose build

# 重启服务
docker-compose up -d
```

## 🌐 生产环境部署

### 1. 修改配置
```bash
# 修改 NEXTAUTH_URL
NEXTAUTH_URL=https://your-domain.com

# 设置生产环境
NODE_ENV=production
```

### 2. 使用反向代理
```nginx
# nginx.conf 示例
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. SSL 证书
```bash
# 使用 Let's Encrypt
certbot --nginx -d your-domain.com
```

## 📚 相关文档

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [Redis 文档](https://redis.io/documentation)

---

**注意**: 
- 确保在生产环境中使用强密码
- 定期备份数据库
- 监控应用性能和资源使用情况
- 保持系统和依赖包的最新版本 