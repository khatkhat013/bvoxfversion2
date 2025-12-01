# DigitalOcean နဲ့ Deploy လုပ်ရန် အကျ့ံချုပ်

## Step 1: DigitalOcean Account ဖွင့်ပါ

1. https://www.digitalocean.com သို့ သွားပါ
2. "Sign up" ကိုနှိပ်ပါ
3. Email သို့မဟုတ် GitHub account နဲ့ ကိုဒ်လုပ်ပါ
4. Payment method သည် ထည့်သွင်းပါ (ကျူးကျူး $5-10 သုံးမည်)

---

## Step 2: Droplet ဆင်ခင်ပါ

### A. "Create" ကိုနှိပ်ပါ → "Droplets"

### B. Configuration ရွေးချယ်ပါ:

| Setting | Value |
|---------|-------|
| **Region** | Singapore / Tokyo (နီးသည့်နေရာ) |
| **OS** | Ubuntu 22.04 x64 |
| **Size** | Basic ($5/month) |
| **Auth** | Password (ပိုလွယ်) သို့မဟုတ် SSH Key |
| **Hostname** | bvox-crypto |

### C. "Create Droplet" နှိပ်ပါ (2-3 မိနစ် စောင့်ပါ)

---

## Step 3: Droplet သို့ SSH ချိတ်ပါ

### Linux/Mac သုံးသူ:
```bash
ssh root@YOUR_DROPLET_IP
```

### Windows PowerShell:
```powershell
ssh root@YOUR_DROPLET_IP
```

(Password သုံးခဲ့ရင် နည်းလမ်း confirm လုပ်ပါ)

---

## Step 4: Droplet မှာ Dependencies ထည့်သွင်းပါ

Droplet ထဲမှာ အောက်ပါ commands လုပ်ပါ:

```bash
# System update
sudo apt update
sudo apt upgrade -y

# Node.js ထည့်သွင်းပါ (Node 18)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Git ထည့်သွင်းပါ
sudo apt install -y git

# Verify
node -v
npm -v
git --version
```

---

## Step 5: Project Clone လုပ်ပါ

```bash
# Home directory သို့သွားပါ
cd ~

# GitHub repository clone လုပ်ပါ
git clone https://github.com/khatkhat013/bvoxfversion2.git

# Project directory သို့သွားပါ
cd bvoxfversion2

# Dependencies ထည့်သွင်းပါ
npm install
```

---

## Step 6: PM2 နဲ့ Server စတင်ပါ

PM2 သည် Node.js process ကို background မှာ ထိန်းချုပ်ပေးပါတယ်။

```bash
# PM2 အပြည့်အစုံ ထည့်သွင်းပါ
sudo npm install -g pm2

# Server ကို PM2 နဲ့ စတင်ပါ
pm2 start server.js --name "bvox-api"

# PM2 startup setup လုပ်ပါ (Reboot လုပ်ပြီးနောက် အလုပ်ခနရ)
pm2 startup
pm2 save

# PM2 status ကြည့်ပါ
pm2 status
pm2 logs
```

---

## Step 7: Firewall Setup လုပ်ပါ

```bash
# Firewall activate လုပ်ပါ
sudo ufw enable

# Port 22 (SSH), 80 (HTTP), 443 (HTTPS) အခွင့်ခံပါ
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000

# Status ကြည့်ပါ
sudo ufw status
```

---

## Step 8: Nginx နဲ့ Reverse Proxy Setup လုပ်ပါ

Nginx သည် port 80 (HTTP) မှ port 3000 သို့ traffic ပြန်ညွှန်းပေးပါတယ်။

```bash
# Nginx ထည့်သွင်းပါ
sudo apt install -y nginx

# Nginx config ဖိုင်ကို edit လုပ်ပါ
sudo nano /etc/nginx/sites-available/default
```

အောက်ပါ content သို့ အစားထိုးပါ:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**ကယ်သိမ်းပါ:** Ctrl+X → Y → Enter

```bash
# Nginx syntax စစ်ပါ
sudo nginx -t

# Nginx restart လုပ်ပါ
sudo systemctl restart nginx
```

---

## Step 9: SSL Certificate (HTTPS) ထည့်သွင်းပါ (Optional)

```bash
# Certbot ထည့်သွင်းပါ
sudo apt install -y certbot python3-certbot-nginx

# Certificate ယူပါ
sudo certbot --nginx -d yourdomain.com
```

(Domain ရှိမှ လုပ်နိုင်ပါတယ်)

---

## Step 10: DigitalOcean Floating IP ကို ချိတ်ပါ (Optional - အဆင်ရှိ လုပ်ပါ)

```bash
# Floating IP ကို droplet နဲ့ သက်ဆိုင်ပြီးရင်
# IP address ကို ရောက်တွေ့မည်ဖြစ်ပါတယ်
```

---

## ✅ အပြီးအစုံ! Server လုပ်ခဲ့သည့်ပြီး

**ဝင်ကြည့်ရန်:**

```
http://YOUR_DROPLET_IP
```

သို့မဟုတ် Domain တွဲမှ:

```
https://yourdomain.com
```

---

## အရိုးရှင်းဆုံး Command Line Setup

```bash
# အားလုံး sequential လုပ်ပါ
ssh root@YOUR_DROPLET_IP

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt update && sudo apt install -y nodejs git nginx

cd ~ && git clone https://github.com/khatkhat013/bvoxfversion2.git
cd bvoxfversion2 && npm install

sudo npm install -g pm2
pm2 start server.js --name "bvox-api"
pm2 startup && pm2 save

sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp

# Nginx setup
sudo nano /etc/nginx/sites-available/default
# (အပေါ်ပြ nginx config အစားထိုးပါ)

sudo nginx -t && sudo systemctl restart nginx

# ✅ အပြီး! ဝင်ကြည့်ပါ: http://YOUR_DROPLET_IP
```

---

## 🆘 Troubleshooting

### Server မလုပ်သည့်အခါ:
```bash
pm2 logs bvox-api
```

### Nginx မလုပ်သည့်အခါ:
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Port 3000 ကြည့်ပါ:
```bash
sudo netstat -tlnp | grep 3000
```

---

## 📊 Server သုံးခြင်းကို Monitor လုပ်ပါ

```bash
# PM2 Monitor dashboard
pm2 monit

# Server CPU/Memory
top
```

---

## 💰 DigitalOcean Pricing

- **$5/month** - 1GB RAM, 1 CPU, 25GB SSD (Entry level)
- **$6/month** - 2GB RAM, 2 CPU, 50GB SSD (အကြံပြု)
- **Downtime မရှိပါ**

---

**✅ အပြီး! ကွန်ယက်မှ ကြည့်နိုင်ပါပြီ!**
