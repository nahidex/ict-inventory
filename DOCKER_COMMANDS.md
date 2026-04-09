# Quick Docker Commands Reference

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
