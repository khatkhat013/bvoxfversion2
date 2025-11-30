# 🔐 WalletConnect & Database Setup Guide

**Date:** November 30, 2025  
**Version:** 2.0

---

## 📋 Overview

This guide will help you set up:
1. ✅ WalletConnect integration (MetaMask, etc.)
2. ✅ MongoDB database
3. ✅ Backend API server with authentication
4. ✅ User authentication system

---

## 🚀 Quick Start (5 Steps)

### **Step 1: Install Dependencies**

```powershell
# Navigate to project
cd "C:\Users\Black Coder\OneDrive\Desktop\crypto-nest\boxf version 2"

# Install backend dependencies
npm install express cors dotenv ethers mongoose bcryptjs jsonwebtoken

# OR use the package.json provided
npm install
```

### **Step 2: Setup MongoDB**

#### Option A: Local MongoDB
```bash
# Download and install from mongodb.com
# Start MongoDB service
mongod

# Create database
use bvox-finance
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add to `.env` file

### **Step 3: Create .env File**

```bash
# Copy the example
cp .env.example .env

# Edit .env with your values
# - MongoDB URI
# - Backend port
# - JWT secret
# - Other settings
```

### **Step 4: Start Backend Server**

```powershell
# Start backend
node backend-server.js

# Expected output:
# ╔════════════════════════════════════════╗
# ║   BVOX Finance Backend Server          ║
# ╚════════════════════════════════════════╝
# 🚀 Server running at: http://localhost:5000
```

### **Step 5: Start Frontend (New Terminal)**

```powershell
# In new terminal window
cd "C:\Users\Black Coder\OneDrive\Desktop\crypto-nest\boxf version 2"

# Start frontend
node server.js

# Open browser at http://localhost:3000
```

---

## 🔧 Component Details

### **1. WalletConnect Components**

#### `js/walletConnect.js`
- Handles wallet detection
- Manages Web3 provider
- Handles account switching
- Manages network switching
- Supports MetaMask, WalletConnect, Coinbase

**Key Methods:**
```javascript
walletManager.connect()           // Connect wallet
walletManager.disconnect()        // Disconnect wallet
walletManager.signMessage(msg)    // Sign message
walletManager.sendTransaction()   // Send transaction
walletManager.addToken()          // Add token to wallet
walletManager.switchNetwork()     // Switch blockchain network
```

#### `js/walletUI.js`
- Provides UI modal for wallet selection
- Shows connected wallet address
- Handles authentication flow
- Shows account menu

**How to Use:**
```javascript
// Automatically initializes on page load
window.walletUI.openModal()       // Show wallet selector
window.walletUI.disconnect()      // Logout user
window.walletUI.copyAddress()     // Copy address to clipboard
```

---

### **2. Backend API Endpoints**

#### Authentication
```
POST /auth/login-wallet
  Request:
    {
      "address": "0x...",
      "signature": "0x...",
      "message": "Sign this message..."
    }
  Response:
    {
      "code": 1,
      "data": {
        "userid": "...",
        "username": "...",
        "token": "...",
        "kycStatus": "none"
      }
    }

POST /auth/logout
  Request: { "token": "..." }
  Response: { "code": 1, "info": "Logout successful" }
```

#### User Profile
```
GET /user/profile
  Headers: { "Authorization": "Bearer <token>" }
  Response: { user profile data }

GET /user/transactions
  Headers: { "Authorization": "Bearer <token>" }
  Response: [ transactions array ]
```

#### Transactions
```
POST /transaction/create
  Request: { "type": "mining", "amount": 100, ... }
  Response: { transaction data }

POST /wallet/getuserzt
  Request: { "userid": "..." }
  Response: { "renzhengzhuangtai": 0, "xinyongfen": 100 }
```

#### KYC
```
POST /kyc/submit
  Request: { "userid": "...", "kycData": {...} }
  Response: { "code": 1, "data": { "status": "basic" } }
```

---

### **3. Database Schema**

#### Users Collection
```javascript
{
  address: "0x...",           // Wallet address
  username: "User_...",       // Auto-generated or custom
  email: "",
  balance: 0,                 // Account balance
  creditScore: 0,             // User credit rating
  kycStatus: "none",          // none | basic | advanced
  status: "active",           // active | suspended | banned
  transactions: [...],        // Transaction IDs
  createdAt: Date,
  lastLogin: Date
}
```

#### Transactions Collection
```javascript
{
  userId: ObjectId,           // Reference to User
  type: "mining",             // mining | trading | loan | arbitrage
  amount: 100,
  currency: "USD",
  status: "pending",          // pending | completed | failed
  txHash: "0x...",            // Blockchain transaction hash
  description: "Mining reward",
  createdAt: Date,
  updatedAt: Date
}
```

#### Sessions Collection
```javascript
{
  userId: ObjectId,
  address: "0x...",
  token: "...",
  signature: "0x...",
  expiresAt: Date,           // 7 days from creation
  createdAt: Date
}
```

---

## 🔐 How Authentication Works

### Step-by-Step Flow

1. **User clicks "Connect Wallet"**
   - WalletConnect modal opens
   - User selects MetaMask or other wallet

2. **Wallet Connection**
   - Browser requests wallet connection
   - User approves in MetaMask
   - Address is captured

3. **Message Signing**
   - Backend sends message to sign
   - User signs in wallet (no gas fees!)
   - Signature proves wallet ownership

4. **Backend Verification**
   - Backend verifies signature
   - User created/found in database
   - Session token issued
   - Token stored in cookies

5. **User Authenticated**
   - All API calls include token
   - User can access protected endpoints
   - Dashboard loads with user data

---

## 📊 Configuration

### Update Frontend Config

Edit `js/config.js`:

```javascript
const API_CONFIG = {
    // Change to your backend server
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
};
```

### Update Backend Config

Edit `.env`:

```env
BACKEND_PORT=5000
MONGODB_URI=mongodb://localhost:27017/bvox-finance
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000
```

---

## 🧪 Testing

### Test Wallet Connection

1. Open http://localhost:3000
2. Click "Connect Wallet" button
3. Select MetaMask
4. Approve connection
5. Sign message when prompted

### Test Backend API

```bash
# Check server health
curl http://localhost:5000/health

# Login with wallet (replace with real address/signature)
curl -X POST http://localhost:5000/auth/login-wallet \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE",
    "signature": "0x...",
    "message": "Sign this message..."
  }'
```

---

## 🛠️ File Structure

```
Project Root/
├── js/
│   ├── config.js              # Frontend config
│   ├── utils.js               # Utilities
│   ├── walletConnect.js        # ✨ Wallet manager
│   └── walletUI.js            # ✨ Wallet UI
│
├── backend-server.js           # ✨ Backend API
├── server.js                   # Frontend server
├── .env.example                # ✨ Environment template
├── package.json                # Dependencies
└── README.md
```

---

## 🐛 Troubleshooting

### MetaMask Not Detected
- Install MetaMask browser extension
- Refresh page after installation
- Check browser console

### Backend Won't Start
- Check Node.js installed: `node --version`
- Check MongoDB running
- Check port 5000 is free
- Check .env file exists

### Database Connection Error
- Verify MongoDB is running
- Check connection string in .env
- For MongoDB Atlas, whitelist IP address
- Check username/password

### Wallet Signature Fails
- Ensure MetaMask is on correct network
- Refresh page and try again
- Check browser console for errors

### API 404 Errors
- Verify backend is running on port 5000
- Check frontend API config points to 5000
- Check endpoint URLs match

---

## 🔒 Security Notes

⚠️ **Important:**
- Never expose private keys
- Never sign untrusted messages
- Always verify signatures on backend
- Use HTTPS in production
- Store JWT secrets securely
- Validate all user inputs
- Use environment variables for secrets
- Regular security audits

---

## 📚 Next Steps

1. ✅ Install dependencies
2. ✅ Setup MongoDB
3. ✅ Create .env file
4. ✅ Start backend server
5. ✅ Test wallet connection
6. ⏭️ Implement smart contracts (optional)
7. ⏭️ Deploy to production
8. ⏭️ Setup monitoring

---

## 🎯 API Integration Checklist

- [ ] Backend server running
- [ ] MongoDB connected
- [ ] Wallet connection working
- [ ] Login flow tested
- [ ] User profile endpoint working
- [ ] Transactions endpoint working
- [ ] KYC endpoint working
- [ ] Error handling implemented
- [ ] Security headers added
- [ ] CORS configured

---

## 📞 Support

For issues:
1. Check browser console (F12)
2. Check backend logs
3. Check .env configuration
4. Verify all services running
5. Check network connectivity

---

## 🎉 You're Ready!

Your WalletConnect and database setup is complete! 

**Start with:**
1. `npm install` - Install dependencies
2. `node backend-server.js` - Start backend
3. `node server.js` - Start frontend
4. Open http://localhost:3000 - Test it out

---

**Last Updated:** November 30, 2025  
**Version:** 2.0  
**Status:** ✅ Ready to Deploy

---
