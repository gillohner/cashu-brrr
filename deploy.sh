#!/bin/bash

# Cashu BRRR - Production Deployment Script
# This script builds and starts the application with PM2

echo "🚀 Starting Cashu BRRR deployment..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! dist directory not found."
    exit 1
fi

# Start or restart with PM2
echo "🎯 Starting with PM2..."
if pm2 list | grep -q "cashu-brrr"; then
    echo "♻️  Restarting existing PM2 process..."
    npm run pm2:restart
else
    echo "✨ Starting new PM2 process..."
    npm run pm2:start
fi

# Save PM2 process list
echo "💾 Saving PM2 process list..."
pm2 save

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 View status: pm2 list"
echo "📝 View logs: npm run pm2:logs"
echo "📈 Monitor: npm run pm2:monit"
echo ""
