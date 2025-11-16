# Deployment Guide

## Overview

This guide covers deployment strategies for the Auth Testing Platform on two primary platforms:

1. **Vercel** - Recommended for testing and production
2. **AWS EC2** - For self-hosted production deployments

---

## Table of Contents

1. [Vercel Deployment](#vercel-deployment)
2. [AWS EC2 Deployment](#aws-ec2-deployment)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [OAuth Configuration](#oauth-configuration)
6. [Post-Deployment](#post-deployment)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Vercel Deployment

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free tier available)
- Database (Neon, Supabase, or Vercel Postgres)

### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git add -A
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### Step 3: Environment Variables

Add these environment variables in Vercel dashboard:

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Auth.js
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="https://your-app.vercel.app"

# better-auth
BETTER_AUTH_SECRET="generate-with-openssl-rand-base64-32"
BETTER_AUTH_URL="https://your-app.vercel.app"

# OAuth - Google
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OAuth - GitHub
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Node Environment
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

**Generate Secrets:**
```bash
openssl rand -base64 32
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-5 minutes)
3. Visit your deployment URL

### Step 5: Run Database Migrations

**Option A: Use Vercel CLI**
```bash
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy
```

**Option B: Use GitHub Actions (Recommended)**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npx prisma migrate deploy

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Vercel-Specific Optimizations

**Enable Edge Runtime (Optional):**
```typescript
// src/app/api/auth/[...nextauth]/route.ts
export const runtime = 'edge'
```

**Configure Caching:**
```typescript
// next.config.ts
export default {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}
```

---

## AWS EC2 Deployment

### Prerequisites
- AWS Account
- Domain name (optional but recommended)
- SSH key pair
- Basic Linux knowledge

### Step 1: Launch EC2 Instance

1. **Choose AMI**: Ubuntu Server 22.04 LTS
2. **Instance Type**: t3.small (minimum, t3.medium for production)
3. **Configure Instance**:
   - Enable Auto-assign Public IP
   - Add IAM role (if using AWS services)
4. **Storage**: 20GB gp3 SSD (minimum)
5. **Security Group**:
   - SSH (22) - Your IP only
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
6. **Key Pair**: Create or use existing

### Step 2: Connect to EC2

```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (Reverse Proxy)
sudo apt install -y nginx

# Install Certbot (SSL Certificates)
sudo apt install -y certbot python3-certbot-nginx
```

### Step 4: Clone and Setup Project

```bash
# Clone repository
git clone https://github.com/your-username/auth-test.git
cd auth-test

# Install dependencies
npm ci

# Create environment file
nano .env.production
```

**Add environment variables:**
```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
AUTH_SECRET="..."
AUTH_URL="https://your-domain.com"
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="https://your-domain.com"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Step 5: Build Application

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Build Next.js application
npm run build
```

### Step 6: Configure PM2

```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'auth-test',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/auth-test',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
}
```

```bash
# Create logs directory
mkdir logs

# Start application
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup
# Run the command it outputs

# Check status
pm2 status
pm2 logs
```

### Step 7: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/auth-test
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/auth-test /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 8: Setup SSL Certificate

```bash
# Get SSL certificate from Let's Encrypt
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 9: Configure Firewall

```bash
# Install UFW
sudo apt install -y ufw

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

### EC2 Deployment Checklist

- [ ] EC2 instance launched and accessible
- [ ] Node.js and dependencies installed
- [ ] Project cloned and built
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] PM2 process manager configured
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Application accessible via domain

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (pooled) | `postgresql://user:pass@host/db` |
| `DIRECT_URL` | PostgreSQL direct connection (migrations) | `postgresql://user:pass@host/db` |
| `AUTH_SECRET` | Auth.js secret key | Generate with OpenSSL |
| `AUTH_URL` | Auth.js callback URL | `https://your-app.com` |
| `BETTER_AUTH_SECRET` | better-auth secret key | Generate with OpenSSL |
| `BETTER_AUTH_URL` | better-auth callback URL | `https://your-app.com` |
| `NODE_ENV` | Environment | `production` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `https://your-app.com` |

### Optional Variables (OAuth)

| Variable | Required For | Where to Get |
|----------|-------------|--------------|
| `GOOGLE_CLIENT_ID` | Google OAuth | [Google Cloud Console](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | Google Cloud Console |
| `GITHUB_CLIENT_ID` | GitHub OAuth | [GitHub Developer Settings](https://github.com/settings/developers) |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth | GitHub Developer Settings |

### Generate Secrets

```bash
# Generate random secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Database Setup

### Neon (Recommended for Vercel)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection strings:
   - **Pooled connection**: Use for `DATABASE_URL`
   - **Direct connection**: Use for `DIRECT_URL`
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection strings:
   - **Transaction pooler**: Use for `DATABASE_URL`
   - **Direct connection**: Use for `DIRECT_URL`
4. Update connection strings with `?pgbouncer=true` for pooled connection

### AWS RDS (for EC2 deployments)

1. Create PostgreSQL instance in RDS
2. Configure security group to allow EC2 instance
3. Use connection string:
   ```
   postgresql://username:password@instance.region.rds.amazonaws.com:5432/dbname
   ```

---

## OAuth Configuration

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - `https://your-app.com/api/auth/callback/google` (Auth.js)
     - `https://your-app.com/api/better-auth/callback/google` (better-auth)
5. Copy Client ID and Client Secret

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in details:
   - Homepage URL: `https://your-app.com`
   - Authorization callback URLs:
     - `https://your-app.com/api/auth/callback/github` (Auth.js)
     - `https://your-app.com/api/better-auth/callback/github` (better-auth)
4. Copy Client ID and generate Client Secret

---

## Post-Deployment

### Verify Deployment

```bash
# Check application health
curl https://your-app.com

# Check database connection
npx prisma db pull

# Check OAuth redirects
# Visit: https://your-app.com/auth-js/signin
# Test Google/GitHub login
```

### Setup Monitoring

**Vercel:**
- Analytics: Built-in (enable in dashboard)
- Logs: View in Vercel dashboard
- Errors: Use [Sentry](https://sentry.io) integration

**EC2:**
```bash
# View PM2 logs
pm2 logs

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Monitor system resources
htop
```

### Database Backups

**Neon/Supabase:**
- Automatic backups included in paid plans
- Configure retention period in dashboard

**AWS RDS:**
```bash
# Enable automated backups
aws rds modify-db-instance \
  --db-instance-identifier your-db \
  --backup-retention-period 7 \
  --apply-immediately
```

**Manual Backup:**
```bash
# Export database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Schedule backups with cron
crontab -e
# Add: 0 2 * * * pg_dump $DATABASE_URL > /backups/backup-$(date +\%Y\%m\%d).sql
```

---

## Monitoring

### Application Monitoring

**Recommended Tools:**
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and error tracking
- **DataDog**: Full-stack monitoring
- **New Relic**: APM and infrastructure monitoring

**Setup Sentry:**
```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

### Uptime Monitoring

**Free Options:**
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://www.pingdom.com)
- [Better Uptime](https://betteruptime.com)

### Security Monitoring

**Recommended:**
- Failed login alerts (via audit logs)
- Rate limiting alerts
- Unusual activity detection
- Security header checks

**Example Alert Script:**
```sql
-- Query for suspicious activity
SELECT email, COUNT(*) as failed_attempts
FROM failed_logins
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY email
HAVING COUNT(*) > 10;
```

---

## Troubleshooting

### Vercel Issues

**Build Failures:**
```bash
# Check build logs in Vercel dashboard
# Common issues:
- Missing environment variables
- TypeScript errors
- Module not found
```

**Runtime Errors:**
```bash
# Check function logs in Vercel dashboard
# Enable detailed logging:
console.log('Debug info:', { variable })
```

### EC2 Issues

**Application Won't Start:**
```bash
# Check PM2 logs
pm2 logs auth-test

# Check Node.js version
node --version

# Rebuild application
npm run build
pm2 restart auth-test
```

**Nginx Issues:**
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

**Database Connection Issues:**
```bash
# Test connection
npx prisma db pull

# Check environment variables
cat .env.production

# Verify firewall rules
sudo ufw status
```

### SSL Certificate Issues

```bash
# Renew certificate manually
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## Performance Optimization

### Next.js Optimizations

```typescript
// next.config.ts
export default {
  // Enable compression
  compress: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },

  // Enable experimental features
  experimental: {
    optimizeCss: true,
  },
}
```

### Database Optimizations

```typescript
// Use connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// Optimize queries
const users = await prisma.user.findMany({
  select: { id: true, email: true }, // Only select needed fields
  take: 10, // Limit results
})
```

### Caching Strategy

```typescript
// API route with caching
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  const data = await fetchData()
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
    }
  })
}
```

---

## Scaling

### Horizontal Scaling (Vercel)
- Automatic scaling included
- Configure in Vercel dashboard:
  - Function regions
  - Edge network
  - Concurrent executions

### Horizontal Scaling (EC2)
1. Create AMI from configured instance
2. Setup Auto Scaling Group
3. Configure Application Load Balancer
4. Use shared database (RDS)
5. Implement session storage (Redis)

### Database Scaling
- **Neon**: Automatic scaling with compute units
- **Supabase**: Upgrade to larger instance
- **RDS**: Vertical scaling (instance size) or read replicas

---

## Rollback Strategy

### Vercel
```bash
# Rollback to previous deployment
vercel rollback

# Or use Vercel dashboard:
# Deployments → Previous deployment → Promote to Production
```

### EC2
```bash
# Keep previous builds
mv auth-test auth-test-backup-$(date +%Y%m%d)
git clone https://github.com/your-username/auth-test.git

# Or use Git to rollback
cd auth-test
git log
git checkout <previous-commit-hash>
npm ci && npm run build
pm2 restart auth-test
```

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [AWS EC2 User Guide](https://docs.aws.amazon.com/ec2/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Certbot Documentation](https://certbot.eff.org/docs/)

---

## Last Updated
November 2025
