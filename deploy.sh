#!/bin/bash

# Asset Lifecycle Management - Deployment Script
# This script deploys the application on Linux server

set -e  # Exit on error

echo "🚀 Asset Lifecycle Deployment Script"
echo "======================================"

# Configuration
PROJECT_DIR="${DEPLOY_PATH:-/DATA/AppData/asset-lifecycle}"
GIT_BRANCH="${GIT_BRANCH:-main}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_warning "Running as root. Consider using a non-root user."
fi

# Navigate to project directory
if [ ! -d "$PROJECT_DIR" ]; then
    print_error "Project directory does not exist: $PROJECT_DIR"
    print_status "Creating directory..."
    mkdir -p "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    
    # Clone repository if not exists
    read -p "Enter your GitHub repository URL: " REPO_URL
    git clone "$REPO_URL" .
else
    cd "$PROJECT_DIR"
    print_status "Changed to project directory: $PROJECT_DIR"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found!"
    print_status "Creating .env file from template..."
    
    cat > .env << EOF
NODE_ENV=production
PORT=5000
DB_HOST=db
DB_PORT=3306
DB_USER=asset_user
DB_PASSWORD=$(openssl rand -base64 32)
DB_NAME=asset_lifecycle_db
JWT_SECRET=$(openssl rand -base64 32)
EOF
    
    print_warning "Please edit .env file with your actual values:"
    print_warning "nano .env"
    read -p "Press enter when you're done editing .env file..."
fi

# Pull latest code
print_status "Pulling latest code from GitHub (branch: $GIT_BRANCH)..."
git fetch origin
git checkout "$GIT_BRANCH"
git pull origin "$GIT_BRANCH"

# Stop running containers
print_status "Stopping existing containers..."
docker compose down || true

# Remove old images (optional - uncomment to cleanup)
# print_status "Removing old images..."
# docker compose down --rmi all || true

# Build new images
print_status "Building Docker images..."
docker compose build --no-cache

# Start containers
print_status "Starting containers..."
docker compose up -d

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 15

# Check if containers are running
print_status "Checking container status..."
if ! docker compose ps | grep -q "Up"; then
    print_error "Some containers failed to start!"
    docker compose logs
    exit 1
fi

# Run database migrations
print_status "Running database migrations..."
docker compose exec -T backend node node_modules/.bin/prisma migrate deploy || print_warning "Migrations failed or already up to date"

# Optional: Seed database (only for first deployment)
read -p "Do you want to seed the database? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Seeding database..."
    docker compose exec -T backend node prisma/seed.js || print_warning "Seeding failed or already seeded"
fi

# Show container status
print_status "Container Status:"
docker compose ps

# Show running services
print_status "Services are running on:"
echo "  Frontend: http://$(hostname -I | awk '{print $1}'):3000"
echo "  Backend:  http://$(hostname -I | awk '{print $1}'):5000"
echo "  Database: localhost:3307 (MySQL)"

# Show recent logs
print_status "Recent logs (last 20 lines):"
docker compose logs --tail=20

echo ""
print_status "Deployment completed successfully! 🎉"
print_status "Use 'docker compose logs -f' to follow logs"
print_status "Use 'docker compose ps' to check status"
