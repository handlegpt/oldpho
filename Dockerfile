# 多阶段构建 - 构建阶段
FROM node:18-alpine AS builder

# 安装 OpenSSL 库
RUN apk add --no-cache openssl

# 设置工作目录
WORKDIR /app

# 设置npm镜像源以提高下载速度
RUN npm config set registry https://registry.npmmirror.com/
RUN npm config set cache /tmp/npm-cache

# 设置环境变量跳过 puppeteer Chrome 下载
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖（使用缓存和超时设置）
RUN npm install --prefer-offline --no-audit --progress=false

# 复制源代码
COPY . .

# 生成 Prisma 客户端
RUN npx prisma generate

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18-alpine AS runner

# 安装 OpenSSL 库和 curl（用于健康检查）
RUN apk add --no-cache openssl curl

# 设置工作目录
WORKDIR /app

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 设置npm镜像源
RUN npm config set registry https://registry.npmmirror.com/

# 设置环境变量跳过 puppeteer Chrome 下载
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true

# 复制 package.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖，确保next-auth正常工作）
RUN npm install --prefer-offline --no-audit --progress=false && npm cache clean --force

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

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# 启动应用
CMD ["node", "server.js"] 