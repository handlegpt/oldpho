# 多阶段构建 - 构建阶段
FROM node:18-alpine AS builder

RUN apk add --no-cache openssl python3 make g++
WORKDIR /app

RUN npm config set registry https://registry.npmjs.org/
RUN npm config set fetch-timeout 300000
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --progress=false || npm install --prefer-offline --no-audit --progress=false

COPY . .
RUN npx prisma generate

# 创建uploads目录
RUN mkdir -p public/uploads && chmod 755 public/uploads

RUN npm run build

# 生产阶段
FROM node:18-alpine AS runner

RUN apk add --no-cache openssl curl
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN npm config set registry https://registry.npmjs.org/

ENV NODE_ENV=production
ENV PORT=3001
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --progress=false || npm install --only=production --prefer-offline --no-audit --progress=false

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# 确保uploads目录存在并设置正确权限
RUN mkdir -p public/uploads && \
    chown -R nextjs:nodejs public/uploads && \
    chmod 777 public/uploads

# 设置整个应用目录的权限
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:3001/api/health || exit 1

CMD ["node", "server.js"] 