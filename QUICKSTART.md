# 🚀 BVOX Finance - Start Here!

## ⏱️ 5-Minute Quick Start

### **Step 1: Verify Node.js Installation** (30 seconds)

Open PowerShell and type:
```powershell
node --version
```

**Expected output:** `v14.0.0` or higher

**If error:** Install Node.js from https://nodejs.org/

---

### **Step 2: Navigate to Project** (30 seconds)

```powershell
cd "C:\Users\Black Coder\OneDrive\Desktop\crypto-nest\boxf version 2"
```

---

### **Step 3: Start Development Server** (30 seconds)

**Option A - Direct Command:**
```powershell
node server.js
```

**Option B - Using PowerShell Script:**
```powershell
.\start.ps1
```

**Option C - Using Batch File:**
```
Double-click: start.bat
```

---

### **Step 4: Open in Browser** (30 seconds)

Go to: **http://localhost:3000**

You should see the BVOX Finance homepage loading!

---

## ✅ Verification Checklist

- [ ] Node.js is installed (check with `node --version`)
- [ ] Server started successfully (see "Server running at..." message)
- [ ] Browser opened at http://localhost:3000
- [ ] No errors in browser console (F12)

---

## 📚 What to Read Next

1. **First Time?** → Read `README.md`
2. **Want to Understand Structure?** → Read `DEVELOPMENT.md`
3. **Need Migration Steps?** → Read `MIGRATION_CHECKLIST.md`
4. **Quick Reference?** → Read `SETUP_COMPLETE.md`

---

## 🔧 Common Commands

| Command | Purpose |
|---------|---------|
| `node server.js` | Start development server |
| `node --version` | Check Node.js version |
| `$env:PORT=8080; node server.js` | Use different port |
| `Ctrl+C` | Stop server |

---

## 💡 Tips

✨ Keep the server running while you develop  
✨ Press F12 in browser to see errors  
✨ Check Network tab to debug API calls  
✨ Server auto-serves all files from project root

---

## ❌ Troubleshooting

### Port Already in Use

```powershell
# Use different port
$env:PORT=3001
node server.js
```

### Node Not Found

Install Node.js: https://nodejs.org/

### Server Won't Start

- Check port 3000 is free
- Check you're in correct directory
- Restart terminal
- Restart computer

---

## 🎯 Next Steps

1. ✅ Get server running (you're here!)
2. Read README.md for configuration
3. Follow MIGRATION_CHECKLIST.md
4. Test your changes
5. Deploy to production

---

**That's it! You're ready to develop!** 🎉

For more info: `cat README.md`
