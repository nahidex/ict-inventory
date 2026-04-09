# Asset Lifecycle Management System - Docker Setup

## Prerequisites

- Docker Desktop (for Windows/Mac) or Docker Engine (for Linux)
- Docker Compose v2.0 or higher

## Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd asset-lifecycle
```

### 2. Set up environment variables
```bash
# Copy the example environment file
cp .env.docker .env

# Edit .env and update the values (especially passwords and JWT_SECRET)
# IMPORTANT: Change DB_PASSWORD and JWT_SECRET before deploying to production!
```

### 3. Build and run the application
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### 4. Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## Docker Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Stop services and remove volumes (WARNING: This deletes database data)
```bash
docker-compose down -v
```

### Rebuild containers
```bash
docker-compose up -d --build
```

### View running containers
```bash
docker-compose ps
```

### Execute commands in containers
```bash
# Access backend container shell
docker-compose exec backend sh

# Run Prisma migrations
docker-compose exec backend npx prisma migrate deploy

# Seed the database
docker-compose exec backend npx prisma db seed

# Access MySQL database
docker-compose exec db mysql -u root -p
```

## Database Migrations

The database migrations run automatically when the backend container starts. If you need to run them manually:

```bash
# Run pending migrations
docker-compose exec backend npx prisma migrate deploy

# Create a new migration (development)
docker-compose exec backend npx prisma migrate dev --name migration_name

# Reset database (WARNING: This deletes all data)
docker-compose exec backend npx prisma migrate reset
```

## Troubleshooting

### Backend won't start
```bash
# Check backend logs
docker-compose logs backend

# Ensure database is healthy
docker-compose ps db

# Restart backend
docker-compose restart backend
```

### Database connection issues
```bash
# Verify database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Test connection
docker-compose exec db mysql -u root -p -e "SHOW DATABASES;"
```

### Frontend can't connect to backend
```bash
# Verify backend is running
docker-compose ps backend

# Check backend health
curl http://localhost:5000/health

# Rebuild frontend with correct API URL
docker-compose up -d --build frontend
```

### Port conflicts
If you get port conflict errors, edit `.env` file and change the port mappings:
```env
PORT=5001  # Change backend port
# Then update docker-compose.yml frontend ports to 8080:80 for example
```

## Production Deployment

### Security Checklist
- [ ] Change `DB_PASSWORD` to a strong, unique password
- [ ] Change `JWT_SECRET` to a random 32+ character string
- [ ] Set `NODE_ENV=production`
- [ ] Update CORS settings in backend
- [ ] Configure proper domain names and SSL certificates
- [ ] Set up database backups
- [ ] Configure log rotation
- [ ] Review and harden nginx configuration

### Using SSL/HTTPS
For production, you should add an nginx reverse proxy or use a service like:
- Traefik with Let's Encrypt
- Nginx Proxy Manager
- Caddy (automatic HTTPS)

## Volume Management

### Backup database
```bash
# Create backup
docker-compose exec db mysqldump -u root -p asset_lifecycle_db > backup.sql

# Restore backup
docker-compose exec -T db mysql -u root -p asset_lifecycle_db < backup.sql
```

### Persistent data locations
- Database data: `mysql_data` volume
- Uploaded files: `./backend/uploads`

## Development Mode

For development with hot-reload:

```bash
# Use development docker-compose file (if created)
docker-compose -f docker-compose.dev.yml up

# Or run frontend and backend locally
cd backend && npm run dev
cd frontend && npm run dev
```

## Clean Up

### Remove all containers, networks, and volumes
```bash
docker-compose down -v
docker system prune -a
```

## Support

For issues and questions, please check:
- Application logs: `docker-compose logs`
- Database logs: `docker-compose logs db`
- Backend logs: `docker-compose logs backend`
- Frontend logs: `docker-compose logs frontend`
