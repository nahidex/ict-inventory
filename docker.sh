#!/bin/bash

# Asset Lifecycle Management - Docker Helper Script

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker and Docker Compose are installed"
}

# Setup environment file
setup_env() {
    print_info "Setting up environment file..."
    if [ ! -f .env ]; then
        if [ -f .env.docker ]; then
            cp .env.docker .env
            print_success "Created .env file from .env.docker"
            print_warning "Please edit .env and update DB_PASSWORD and JWT_SECRET!"
        else
            print_error ".env.docker file not found"
            exit 1
        fi
    else
        print_warning ".env file already exists"
    fi
}

# Build containers
build() {
    print_info "Building Docker containers..."
    docker-compose build
    print_success "Containers built successfully"
}

# Start containers
start() {
    print_info "Starting Docker containers..."
    docker-compose up -d
    print_success "Containers started successfully"
    print_info "Frontend: http://localhost:3000"
    print_info "Backend API: http://localhost:5000"
}

# Stop containers
stop() {
    print_info "Stopping Docker containers..."
    docker-compose down
    print_success "Containers stopped successfully"
}

# Restart containers
restart() {
    print_info "Restarting Docker containers..."
    docker-compose restart
    print_success "Containers restarted successfully"
}

# View logs
logs() {
    if [ -z "$1" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$1"
    fi
}

# Show status
status() {
    print_info "Container status:"
    docker-compose ps
}

# Run migrations
migrate() {
    print_info "Running database migrations..."
    docker-compose exec backend npx prisma migrate deploy
    print_success "Migrations completed successfully"
}

# Seed database
seed() {
    print_info "Seeding database..."
    docker-compose exec backend npx prisma db seed
    print_success "Database seeded successfully"
}

# Clean up everything
clean() {
    print_warning "This will remove all containers, volumes, and data. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "Cleaning up..."
        docker-compose down -v
        print_success "Clean up completed"
    else
        print_info "Clean up cancelled"
    fi
}

# Full setup
setup() {
    check_docker
    setup_env
    build
    start
    sleep 5
    migrate
    print_success "Setup completed!"
    print_info "Frontend: http://localhost:3000"
    print_info "Backend API: http://localhost:5000"
}

# Show help
show_help() {
    cat << EOF
Asset Lifecycle Management - Docker Helper Script

Usage: ./docker.sh [command]

Commands:
    setup       - Complete setup (env, build, start, migrate)
    build       - Build Docker containers
    start       - Start containers
    stop        - Stop containers
    restart     - Restart containers
    logs [svc]  - View logs (optional: specify service)
    status      - Show container status
    migrate     - Run database migrations
    seed        - Seed database
    clean       - Remove all containers and volumes
    help        - Show this help message

Examples:
    ./docker.sh setup          # Full setup
    ./docker.sh logs backend   # View backend logs
    ./docker.sh migrate        # Run migrations

EOF
}

# Main script
case "$1" in
    setup)
        setup
        ;;
    build)
        build
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs "$2"
        ;;
    status)
        status
        ;;
    migrate)
        migrate
        ;;
    seed)
        seed
        ;;
    clean)
        clean
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
