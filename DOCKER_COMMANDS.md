# Quick Docker Commands Reference

## Architecture Overview

This application uses **Nginx Reverse Proxy** architecture:
- **Frontend**: Port 3000 (Nginx serving static files + reverse proxy)
- **Backend**: Internal only (accessed via nginx proxy at /api)
- **Database**: Internal only (port 3307 optional for external access)

**Access URLs:**
- Frontend: `http://server-ip:3000`
- Backend API: `http://server-ip:3000/api` (proxied internally)
- Uploads: `http://server-ip:3000/uploads` (proxied internally)

## Common Commands

### Start services
```bash
docker compose up -d
```

### View logs
```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
```

### Stop services
```bash
docker compose down
```

### Rebuild and restart
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Check status
```bash
docker compose ps
```

### Run migrations
```bash
docker compose exec backend node node_modules/prisma/build/index.js migrate deploy
```

### Seed database
```bash
docker compose exec backend node prisma/seed.js
```

## Note
Use `docker compose` (with space) for newer Docker versions.
For older versions, use `docker-compose` (with hyphen).
