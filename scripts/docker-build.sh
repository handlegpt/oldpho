#!/bin/bash

# Docker build script with retry mechanism and detailed logging

set -e

echo "🚀 Starting Docker build process..."

# Configuration
MAX_RETRIES=3
RETRY_DELAY=30
BUILD_TIMEOUT=1800  # 30 minutes

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running or not accessible"
        exit 1
    fi
    print_status "Docker is running"
}

# Function to clean up Docker resources
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker system prune -f > /dev/null 2>&1 || true
    docker builder prune -f > /dev/null 2>&1 || true
}

# Function to build with timeout and retry
build_with_retry() {
    local attempt=1
    
    while [ $attempt -le $MAX_RETRIES ]; do
        print_status "Build attempt $attempt of $MAX_RETRIES"
        
        # Set build timeout
        timeout $BUILD_TIMEOUT docker build \
            --no-cache \
            --progress=plain \
            --build-arg BUILDKIT_INLINE_CACHE=1 \
            -t oldpho:latest \
            . || {
            
            if [ $? -eq 124 ]; then
                print_error "Build timed out after ${BUILD_TIMEOUT}s"
            else
                print_error "Build failed with exit code $?"
            fi
            
            if [ $attempt -lt $MAX_RETRIES ]; then
                print_warning "Retrying in ${RETRY_DELAY}s..."
                sleep $RETRY_DELAY
                cleanup
            else
                print_error "All build attempts failed"
                exit 1
            fi
        } && {
            print_status "Build completed successfully!"
            return 0
        }
        
        attempt=$((attempt + 1))
    done
}

# Main execution
main() {
    print_status "Starting Docker build process..."
    
    # Check Docker
    check_docker
    
    # Clean up before building
    cleanup
    
    # Build with retry mechanism
    build_with_retry
    
    print_status "Build process completed successfully!"
    
    # Show image info
    print_status "Built image information:"
    docker images oldpho:latest --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
}

# Run main function
main "$@" 