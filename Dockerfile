# 多阶段构建 - 构建阶段
FROM node:18-alpine AS builder

# 安装必要的系统依赖
RUN apk add --no-cache openssl python3 make g++

# 设置工作目录
WORKDIR /app

# 设置npm配置以提高下载速度
RUN npm config set registry https://registry.npmjs.org/
RUN npm config set fetch-timeout 300000
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000

# 设置环境变量跳过 puppeteer Chrome 下载
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV NODE_ENV=production

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖（使用更高效的安装策略）
RUN npm ci --only=production --prefer-offline --no-audit --progress=false || npm install --only=production --prefer-offline --no-audit --progress=false

# 复制源代码
COPY . .

# 生成 Prisma 客户端
RUN npx prisma generate

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18-alpine AS runner

# 安装必要的系统依赖
RUN apk add --no-cache openssl curl

# 设置工作目录
WORKDIR /app

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 设置npm配置
RUN npm config set registry https://registry.npmjs.org/

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true

# 复制 package.json
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production --prefer-offline --no-audit --progress=false || npm install --only=production --prefer-offline --no-audit --progress=false

# 复制构建产物
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 复制 Prisma 相关文件
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# 设置权限
RUN chown -R nextjs:nodejs /app
USER nextjs

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# 启动应用
CMD ["node", "server.js"] 