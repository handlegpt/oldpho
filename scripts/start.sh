#!/bin/bash

# OldPho 启动脚本
echo "🚀 启动 OldPho AI 照片修复应用..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    log_error "Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 检查 Docker 服务是否运行
if ! docker info &> /dev/null; then
    log_error "Docker 服务未运行，请启动 Docker"
    exit 1
fi

# 检查环境变量文件
if [ ! -f .env ]; then
    log_info "创建环境变量文件..."
    cp .example.env .env
    log_warning "请编辑 .env 文件，配置必要的环境变量"
    log_warning "特别是 REPLICATE_API_KEY 和 NEXTAUTH_SECRET"
fi

# 检查必要的环境变量
if ! grep -q "REPLICATE_API_KEY=" .env || grep -q "REPLICATE_API_KEY=$" .env; then
    log_warning "REPLICATE_API_KEY 未配置"
fi

if ! grep -q "NEXTAUTH_SECRET=" .env || grep -q "NEXTAUTH_SECRET=$" .env; then
    log_warning "NEXTAUTH_SECRET 未配置"
fi

# 停止现有容器
log_info "停止现有容器..."
docker-compose down --remove-orphans

# 清理 Docker 缓存
log_info "清理 Docker 缓存..."
docker system prune -f

# 启动服务
log_info "启动 Docker 容器..."
docker-compose up --build -d

# 等待服务启动
log_info "等待服务启动..."
sleep 15

# 检查容器状态
log_info "检查容器状态..."
if ! docker-compose ps | grep -q "Up"; then
    log_error "容器启动失败，请检查日志"
    docker-compose logs
    exit 1
fi

# 执行数据库迁移
log_info "执行数据库迁移..."
docker-compose exec -T app npx prisma migrate deploy || {
    log_warning "数据库迁移失败，尝试重新生成..."
    docker-compose exec -T app npx prisma generate
}

# 检查服务状态
log_info "检查服务状态..."
docker-compose ps

# 健康检查
log_info "执行健康检查..."
sleep 10
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    log_success "健康检查通过"
else
    log_warning "健康检查失败，请检查日志"
    docker-compose logs --tail=50
fi

# 显示访问信息
log_success "OldPho 应用已启动！"
echo ""
echo -e "${GREEN}🌐 访问地址:${NC} http://localhost:3001"
echo -e "${GREEN}📊 健康检查:${NC} http://localhost:3001/api/health"
echo ""
echo -e "${BLUE}📝 常用命令:${NC}"
echo "  查看日志: docker-compose logs -f"
echo "  停止服务: docker-compose down"
echo "  重启服务: docker-compose restart"
echo "  查看状态: docker-compose ps"
echo ""
echo -e "${YELLOW}💡 提示:${NC}"
echo "  - 首次访问可能需要等待几秒钟"
echo "  - 如果遇到问题，请查看日志: docker-compose logs"
echo "  - 确保已配置 REPLICATE_API_KEY 才能使用照片修复功能" 