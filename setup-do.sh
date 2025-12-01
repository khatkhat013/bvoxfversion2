#!/bin/bash

# BVOX Finance - DigitalOcean Droplet Setup Script
# Run this script on a fresh Ubuntu 22.04 droplet
# Usage: bash setup-do.sh

echo "================================================"
echo "🚀 BVOX Finance - DigitalOcean Setup Started"
echo "================================================"

# Update system
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install Node.js
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
echo "📦 Installing Git..."
sudo apt install -y git

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Verify installations
echo ""
echo "✅ Checking installations..."
echo "Node: $(node -v)"
echo "NPM: $(npm -v)"
echo "Git: $(git --version)"

# Clone repository
echo ""
echo "📥 Cloning GitHub repository..."
cd ~
git clone https://github.com/khatkhat013/bvoxfversion2.git
cd bvoxfversion2

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

# Start with PM2
echo ""
echo "🚀 Starting server with PM2..."
pm2 start server.js --name "bvox-api"
pm2 startup
pm2 save

# Setup Firewall
echo "🔒 Setting up firewall..."
sudo ufw --force enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp

# Create Nginx config
echo "⚙️ Configuring Nginx..."
sudo tee /etc/nginx/sites-available/default > /dev/null <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx

# Show status
echo ""
echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "📍 Your Droplet IP: $(hostname -I | awk '{print $1}')"
echo "🌐 Access your app at: http://$(hostname -I | awk '{print $1}')"
echo ""
echo "📊 Check server status:"
echo "   pm2 status"
echo "   pm2 logs bvox-api"
echo ""
echo "⚙️ Check Nginx:"
echo "   sudo systemctl status nginx"
echo "   sudo nginx -t"
echo ""
echo "🔄 Restart server:"
echo "   pm2 restart bvox-api"
echo "   pm2 restart bvox-api --watch"
echo ""
echo "================================================"
