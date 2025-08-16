# 使用官方Node.js运行时作为基础镜像
FROM node:18-alpine AS base

# 设置工作目录
WORKDIR /app

# 安装系统依赖和安全更新
RUN apk update && apk upgrade && \
    apk add --no-cache \
    dumb-init \
    curl \
    && rm -rf /var/cache/apk/*

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 复制package文件
COPY package*.json ./

# 生成package-lock.json（如果不存在）并安装依赖
RUN npm install && npm cache clean --force

# 复制源代码
COPY . .

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建必要的目录并设置权限
RUN mkdir -p /app/public/uploads && \
    chown -R nextjs:nodejs /app && \
    chmod -R 755 /app && \
    chmod 750 /app/public/uploads

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# 使用dumb-init作为PID 1
ENTRYPOINT ["dumb-init", "--"]

# 启动命令
CMD ["npm", "start"] 