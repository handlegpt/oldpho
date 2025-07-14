#!/bin/bash

# Docker构建优化脚本

echo "🚀 开始构建Docker镜像..."

# 清理旧的构建缓存
echo "🧹 清理旧的构建缓存..."
docker system prune -f

# 设置构建参数
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# 构建镜像（使用BuildKit和缓存）
echo "🔨 构建Docker镜像..."
docker-compose build --no-cache --parallel

# 如果构建成功，启动服务
if [ $? -eq 0 ]; then
    echo "✅ 构建成功！启动服务..."
    docker-compose up -d
    
    echo "📊 服务状态："
    docker-compose ps
    
    echo "🔍 查看日志："
    docker-compose logs -f app
else
    echo "❌ 构建失败！"
    exit 1
fi 