# Auto Deployment Setup Guide

এই guide অনুসরণ করে আপনি GitHub এ code push করলে automatically Linux server এ deploy হবে।

## 📋 Prerequisites

- Linux server with Docker & Docker Compose installed
- GitHub repository
- SSH access to server

## 🔧 Server Setup (One-time)

### 1. Server এ Project Setup করুন

```bash
# SSH করে server এ login করুন
ssh your-username@your-server-ip

# Project directory তৈরি করুন
mkdir -p /DATA/AppData/asset-lifecycle
cd /DATA/AppData/asset-lifecycle

# Git repository clone করুন
git clone https://github.com/your-username/asset-lifecycle.git .

# Deployment script executable করুন
chmod +x deploy.sh

# .env file তৈরি করুন
nano .env
```

### 2. `.env` File Configuration

```env
NODE_ENV=production
PORT=5000
DB_HOST=db
DB_PORT=3306
DB_USER=asset_user
DB_PASSWORD=your_secure_password_here
DB_NAME=asset_lifecycle_db
JWT_SECRET=your_jwt_secret_minimum_32_characters
```

### 3. Manual Deployment Test (প্রথমবার)

```bash
# Deploy script run করুন
./deploy.sh

# অথবা manual deployment:
docker compose up -d
docker compose exec backend node node_modules/prisma/build/index.js migrate deploy
docker compose exec backend node prisma/seed.js
```

## 🔐 GitHub Secrets Setup

GitHub repository তে auto-deployment enable করার জন্য secrets add করুন:

### 1. GitHub Repository Settings যান
- Repository → Settings → Secrets and variables → Actions → New repository secret

### 2. নিচের secrets add করুন:

#### `SERVER_HOST`
```
your-server-ip-address
```
Example: `192.168.1.100` অথবা `server.example.com`

#### `SERVER_USER`
```
your-ssh-username
```
Example: `ubuntu`, `root`, অথবা `admin`

#### `SERVER_SSH_KEY`
আপনার SSH private key paste করুন।

**SSH Key generate করতে (যদি না থাকে):**

```bash
# Local machine এ run করুন
ssh-keygen -t ed25519 -C "github-actions-deploy"

# Public key copy করুন এবং server এ add করুন
cat ~/.ssh/id_ed25519.pub

# Server এ:
echo "your-public-key-here" >> ~/.ssh/authorized_keys

# Private key copy করুন GitHub Secret এ add করার জন্য
cat ~/.ssh/id_ed25519
```

#### `SERVER_PORT` (Optional)
```
22
```
Default SSH port. শুধুমাত্র যদি আপনার SSH port আলাদা হয়।

#### `DEPLOY_PATH` (Optional)
```
/DATA/AppData/asset-lifecycle
```
Server এ project এর location। Default: `/DATA/AppData/asset-lifecycle`

## 🚀 Auto Deployment Workflow

এখন থেকে যখনই আপনি `main` বা `master` branch এ code push করবেন:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

**Automatically এই কাজগুলো হবে:**

1. ✅ GitHub থেকে latest code pull হবে
2. ✅ Docker containers stop হবে
3. ✅ নতুন Docker images build হবে
4. ✅ Containers start হবে
5. ✅ Database migrations run হবে
6. ✅ Container status check হবে
7. ✅ Logs show করবে

## 📊 Deployment Status Check

### GitHub Actions এ দেখুন:
- Repository → Actions tab
- Latest workflow run দেখুন
- Success/Failure status দেখুন
- Detailed logs দেখুন

### Server এ check করুন:
```bash
# Container status
docker compose ps

# Logs দেখুন
docker compose logs -f

# Specific service logs
docker compose logs backend -f
```

## 🔄 Manual Deployment

যদি manually deploy করতে চান:

```bash
# Server এ SSH করুন
ssh your-username@your-server-ip

# Project directory তে যান
cd /DATA/AppData/asset-lifecycle

# Deployment script run করুন
./deploy.sh
```

## 🛠️ Troubleshooting

### Deployment Failed?

1. **GitHub Actions logs check করুন:**
   - Repository → Actions → Failed workflow → Logs

2. **SSH connection verify করুন:**
   ```bash
   ssh -i ~/.ssh/your-key your-user@your-server
   ```

3. **Server logs check করুন:**
   ```bash
   docker compose logs
   ```

4. **Manually deploy করে দেখুন:**
   ```bash
   ./deploy.sh
   ```

### Common Issues:

**Issue: SSH Connection Failed**
- Server IP সঠিক আছে কিনা check করুন
- SSH key properly added আছে কিনা verify করুন
- Server এ SSH access আছে কিনা test করুন

**Issue: Database Migration Failed**
- Database running আছে কিনা check করুন: `docker compose ps`
- Database logs দেখুন: `docker compose logs db`
- Manually migrate করুন: `docker compose exec backend node node_modules/prisma/build/index.js migrate deploy`

**Issue: Container Won't Start**
- `.env` file properly configured আছে কিনা check করুন
- Port conflicts আছে কিনা check করুন: `netstat -tulpn | grep -E '3000|5000|3307'`
- Disk space আছে কিনা check করুন: `df -h`

## 📝 Advanced Configuration

### Database Seed on Every Deploy (Optional)

যদি প্রতিবার deploy এ database seed করতে চান, `.github/workflows/deploy.yml` file এ uncomment করুন:

```yaml
# Uncomment these lines:
echo "🌱 Seeding database..."
docker compose exec -T backend node prisma/seed.js
```

### Custom Deployment Path

যদি আলাদা path ব্যবহার করতে চান:
1. GitHub Secrets এ `DEPLOY_PATH` add করুন
2. Server এ সেই path এ project clone করুন

### Multiple Environments

Dev, Staging, Production এর জন্য আলাদা workflow:
- `.github/workflows/deploy-dev.yml`
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-prod.yml`

## 🔗 Useful Commands

```bash
# Container restart
docker compose restart

# View all logs
docker compose logs

# Follow logs
docker compose logs -f

# Rebuild and restart
docker compose up -d --build

# Stop all
docker compose down

# Clean everything
docker compose down --volumes --rmi all

# Database backup
docker compose exec db mysqldump -u asset_user -p asset_lifecycle_db > backup.sql
```

## ✅ Verification Checklist

- [ ] Server এ Docker installed আছে
- [ ] Project cloned এবং `.env` configured
- [ ] GitHub Secrets properly added
- [ ] SSH key working properly
- [ ] Manual deployment test successful
- [ ] GitHub Actions workflow enabled
- [ ] Test push করে auto-deployment verify করেছি

## 🎉 Success!

সব কিছু ঠিকমতো setup হলে এখন থেকে শুধু code লিখে push করবেন, বাকি সব automatic হবে! 🚀
