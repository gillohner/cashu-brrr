# PM2 Deployment Guide for Cashu BRRR

## Prerequisites

1. **Node.js** (v16 or higher)
2. **PM2** installed globally
   ```bash
   npm install -g pm2
   ```

## Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Application

```bash
npm run build
```

This will create a `dist` folder with your production-ready static files.

### 3. Start with PM2

```bash
npm run pm2:start
```

Or directly:
```bash
pm2 start ecosystem.config.cjs
```

## Available PM2 Scripts

### Start the application
```bash
npm run pm2:start
```

### Stop the application
```bash
npm run pm2:stop
```

### Restart the application
```bash
npm run pm2:restart
```

### Delete from PM2
```bash
npm run pm2:delete
```

### View logs
```bash
npm run pm2:logs
```

### Monitor application
```bash
npm run pm2:monit
```

## PM2 Useful Commands

### View all running apps
```bash
pm2 list
```

### Save PM2 process list (auto-restart on server reboot)
```bash
pm2 save
pm2 startup
```

### View detailed info
```bash
pm2 show cashu-brrr
```

### Flush logs
```bash
pm2 flush
```

## Configuration

### Port Configuration
Default port is **3000**. To change it, edit `ecosystem.config.cjs`:

```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3000  // Change this
}
```

### Log Files
Logs are stored in the `logs/` directory:
- `logs/err.log` - Error logs
- `logs/out.log` - Standard output logs
- `logs/combined.log` - Combined logs

## Production Deployment Workflow

```bash
# 1. Pull latest changes
git pull

# 2. Install any new dependencies
npm install

# 3. Build the app
npm run build

# 4. Restart PM2 process
npm run pm2:restart
```

## Nginx Configuration (Optional)

If you want to use Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Check if app is running
```bash
pm2 list
```

### View real-time logs
```bash
npm run pm2:logs
```

### Restart if crashed
```bash
npm run pm2:restart
```

### Check memory usage
```bash
pm2 monit
```
