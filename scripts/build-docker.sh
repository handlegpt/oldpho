#!/bin/bash

# Docker 构建脚本
# 包含重试机制和错误处理

set -e

echo "🐳 开始 Docker 构建..."

# 设置环境变量
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_SKIP_DOWNLOAD=true
export DOCKER_BUILDKIT=1

# 构建参数
IMAGE_NAME="oldpho"
TAG="latest"
MAX_RETRIES=3
RETRY_COUNT=0

# 重试函数
retry_build() {
    local exit_code=$?
    
    if [ $exit_code -ne 0 ] && [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
        RETRY_COUNT=$((RETRY_COUNT + 1))
        echo "❌ 构建失败，正在重试 ($RETRY_COUNT/$MAX_RETRIES)..."
        sleep 10
        return 1
    fi
    
    return $exit_code
}

# 构建函数
build_image() {
    echo "🔨 构建镜像: $IMAGE_NAME:$TAG"
    
    # 使用 BuildKit 和缓存
    docker build \
        --build-arg PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
        --build-arg PUPPETEER_SKIP_DOWNLOAD=true \
        --cache-from $IMAGE_NAME:$TAG \
        --tag $IMAGE_NAME:$TAG \
        --progress=plain \
        . || retry_build
}

# 主构建流程
echo "📋 构建配置:"
echo "  - 镜像名称: $IMAGE_NAME"
echo "  - 标签: $TAG"
echo "  - 最大重试次数: $MAX_RETRIES"
echo "  - 跳过 Puppeteer Chrome 下载: 是"

# 清理旧的构建缓存（可选）
if [ "$1" = "--clean" ]; then
    echo "🧹 清理构建缓存..."
    docker builder prune -f
fi

# 开始构建
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if build_image; then
        echo "✅ 构建成功！"
        break
    fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ 构建失败，已达到最大重试次数"
    exit 1
fi

echo "🎉 Docker 镜像构建完成！"
echo "📦 镜像: $IMAGE_NAME:$TAG"
echo ""
echo "💡 运行容器:"
echo "  docker run -p 3001:3001 $IMAGE_NAME:$TAG" 