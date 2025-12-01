# Admin Dashboard Integration Guide

## Overview
This document explains how to integrate the admin dashboard (`admin-users.html`) with your existing application and access it from various pages.

---

## Quick Access Links

### Add to Navigation Menu
Add these links to your main navigation/menu:

#### HTML
```html
<!-- Add to your navigation -->
<a href="/admin-users.html" class="nav-link" target="_blank">Admin Dashboard</a>

<!-- Or with icon -->
<a href="/admin-users.html" class="btn btn-admin">
  <i class="icon-admin"></i> Admin Panel
</a>
```

#### CSS
```css
.nav-link {
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-link:hover {
  background: #667eea;
  color: white;
}

.btn-admin {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
}
```

---

## Page Integration Examples

### Example 1: Add Admin Button to index.html
```html
<!-- In index.html header or nav -->
<header>
  <nav>
    <a href="index.html">Home</a>
    <a href="wallet-connect.html">Wallet</a>
    <a href="assets.html">Assets</a>
    
    <!-- Admin Link -->
    <a href="admin-users.html" style="background: #667eea; color: white; padding: 8px 16px; border-radius: 4px;">
      Admin Dashboard
    </a>
  </nav>
</header>
```

### Example 2: Add Admin Button in assets.html
```html
<!-- Add to assets.html in a fixed button or corner -->
<button class="admin-access-btn" onclick="window.open('admin-users.html', '_blank')" 
        style="position: fixed; bottom: 20px; right: 20px; background: #667eea; color: white; 
               padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; z-index: 999;">
  👤 Admin
</button>
```

### Example 3: Floating Admin Icon
```html
<!-- Add floating admin button to any page -->
<style>
  .floating-admin {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 28px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    transition: all 0.3s;
    z-index: 999;
    text-decoration: none;
  }

  .floating-admin:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
  }
</style>

<!-- Add to page body -->
<a href="admin-users.html" target="_blank" class="floating-admin" title="Open Admin Dashboard">👤</a>
```

---

## Access Control (Optional)

### Add Basic Admin Check
If you want to restrict access to admin dashboard, add this to `admin-users.html`:

```javascript
// Add at the top of admin-users.html <script> section
$(document).ready(function() {
    // Check if user is admin
    const isAdmin = Cookies.get('is_admin') === 'true';
    const adminToken = Cookies.get('admin_token');
    
    if (!isAdmin && !adminToken) {
        // Uncomment this for production:
        // alert('Admin access denied');
        // window.location.href = 'index.html';
        console.warn('Non-admin user accessing admin dashboard');
    }
});
```

### Set Admin Token on Login
When admin logs in (if you have admin auth), set:

```javascript
// After successful admin login
Cookies.set('admin_token', token, { expires: 7 });
Cookies.set('is_admin', 'true', { expires: 7 });
```

---

## Enhanced Dashboard Access

### Method 1: Direct Button in Header
```html
<!-- In any HTML page header -->
<button onclick="window.location.href='admin-users.html'" class="btn-admin">
  Admin Panel
</button>
```

### Method 2: Dropdown Menu
```html
<div class="admin-menu">
  <button onclick="toggleAdminMenu()">☰ Admin</button>
  <div id="adminMenu" class="admin-dropdown" style="display: none;">
    <a href="admin-users.html">User Management</a>
    <a href="admin-users.html#balances">Manage Balances</a>
    <a href="admin-users.html#transactions">Transactions</a>
    <a href="admin-users.html#deposits">Deposits</a>
    <a href="admin-users.html#withdrawals">Withdrawals</a>
  </div>
</div>

<script>
  function toggleAdminMenu() {
    const menu = document.getElementById('adminMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  }
</script>
```

### Method 3: Modal/Popup Link
```html
<!-- Add link that opens in modal -->
<button onclick="openAdminDashboard()">Open Admin Dashboard</button>

<script>
  function openAdminDashboard() {
    window.open('admin-users.html', 'adminWindow', 
                'width=1400,height=800,scrollbars=yes');
  }
</script>
```

---

## Direct Section Navigation

You can link directly to specific sections of the admin dashboard:

### Link to Manage Balances
```html
<a href="admin-users.html?section=balances">Manage User Balances</a>
```

### Link to Deposits
```html
<a href="admin-users.html?section=deposits">View Pending Deposits</a>
```

### Link to Withdrawals
```html
<a href="admin-users.html?section=withdrawals">View Pending Withdrawals</a>
```

### Link to Users
```html
<a href="admin-users.html?section=users">Manage Users</a>
```

### Link to Transactions
```html
<a href="admin-users.html?section=transactions">View Transactions</a>
```

### Link to Exchanges
```html
<a href="admin-users.html?section=exchanges">View Exchanges</a>
```

---

## API Integration with Other Pages

### From assets.html
```javascript
// Fetch user balances for display
$.post(apiurl + "/Wallet/getbalance", {
    userid: Cookies.get('userid')
}, function(res) {
    // Display balances
});

// Admin can also directly update balances
$.post(apiurl + '/Admin/updateUserBalance', {
    userid: targetUserID,
    usdt: 5000,
    btc: 0.5,
    eth: 10,
    usdc: 3000,
    pyusd: 2000,
    sol: 500
}, function(res) {
    if (res.code == 1) {
        alert('Balance updated!');
    }
});
```

### From admin-users.html to View Assets
```javascript
// View a specific user's assets (from admin)
function viewUserAssets(userId) {
    // Could open assets.html with userId parameter
    window.open(`assets.html?userid=${userId}`);
}
```

---

## Sidebar/Menu Integration

### Add to Existing Sidebar
```html
<!-- If you have a main navigation sidebar -->
<div class="sidebar">
  <a href="index.html">Home</a>
  <a href="wallet-connect.html">Wallet</a>
  <a href="assets.html">Assets</a>
  <a href="mining.html">Mining</a>
  
  <!-- Admin Section -->
  <hr>
  <h3 style="font-size: 12px; color: #999;">ADMIN</h3>
  <a href="admin-users.html">👤 User Management</a>
  <a href="admin-users.html?section=balances">💰 Balances</a>
  <a href="admin-users.html?section=deposits">📥 Deposits</a>
  <a href="admin-users.html?section=withdrawals">📤 Withdrawals</a>
  <a href="admin-users.html?section=transactions">📊 Transactions</a>
</div>
```

---

## Database Connections

The admin dashboard works with these data files:

| File | Purpose | Used By |
|------|---------|---------|
| `users.json` | User info & balances | All pages |
| `topup_records.json` | Deposit history | Admin, Assets |
| `withdrawals_records.json` | Withdrawal history | Admin, Assets |
| `exchange_records.json` | Exchange history | Admin, Contract |
| `admins.json` | Admin credentials | Admin auth |

---

## URL Patterns

### Current Implementation
```
http://localhost:3000/admin-users.html
```

### With Query Parameters (For Future Enhancement)
```
http://localhost:3000/admin-users.html?section=balances&userid=1001
http://localhost:3000/admin-users.html?section=deposits&filter=pending
http://localhost:3000/admin-users.html?section=transactions&user=1001
```

---

## Logging & Tracking

### Track Admin Actions (Future Enhancement)
```javascript
function logAdminAction(action, details) {
    const log = {
        timestamp: new Date(),
        admin: Cookies.get('admin_id'),
        action: action,
        details: details
    };
    
    // Send to server to log
    $.post(apiurl + '/Admin/logAction', log);
}

// Usage
logAdminAction('balance_updated', { userid: 1001, coin: 'usdt', amount: 5000 });
```

---

## Production Deployment

### Security Checklist
- [ ] Add admin authentication
- [ ] Implement admin role-based access
- [ ] Enable HTTPS only
- [ ] Add rate limiting to admin endpoints
- [ ] Log all admin actions
- [ ] Add 2-factor authentication for admins
- [ ] Backup JSON files regularly
- [ ] Move to database instead of JSON files
- [ ] Add admin audit trail
- [ ] Implement session management

### Performance Optimization
```javascript
// Cache user list to reduce API calls
let userCache = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedUsers(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && userCache.data && (now - cacheTimestamp) < CACHE_DURATION) {
        return Promise.resolve(userCache.data);
    }
    
    return $.get(apiurl + '/Admin/getAllUsers').then(res => {
        userCache.data = res.data;
        cacheTimestamp = now;
        return res.data;
    });
}
```

---

## Common Integration Patterns

### Pattern 1: Admin Access from User Profile
```javascript
function openUserAdmin(userId) {
    // Store selected user ID
    sessionStorage.setItem('admin_selected_user', userId);
    // Open admin dashboard with balances section
    window.open('admin-users.html?section=balances');
}
```

### Pattern 2: Monitor User Activity
```javascript
// Show admin alerts for suspicious activity
function checkAdminAlerts() {
    $.get(apiurl + '/Admin/getAlerts', function(res) {
        if (res.data.length > 0) {
            showNotification(`⚠️ ${res.data.length} alerts pending`);
        }
    });
}

// Run every 30 seconds
setInterval(checkAdminAlerts, 30000);
```

### Pattern 3: Quick Balance Update Widget
```html
<!-- Embed quick balance update form anywhere -->
<form onsubmit="quickUpdateBalance(event)">
  <input type="text" id="quickUserID" placeholder="User ID" required>
  <input type="number" id="quickAmount" placeholder="USDT Amount" required>
  <button type="submit">Add Balance</button>
</form>

<script>
  function quickUpdateBalance(e) {
    e.preventDefault();
    const userid = $('#quickUserID').val();
    const amount = $('#quickAmount').val();
    
    $.post(apiurl + '/Admin/updateUserBalance', {
        userid: userid,
        usdt: amount,
        btc: 0, eth: 0, usdc: 0, pyusd: 0, sol: 0
    }, function(res) {
        alert(res.data);
        e.target.reset();
    });
  }
</script>
```

---

## Version Compatibility

- **admin-users.html**: v1.0 (Production Ready)
- **server.js**: Updated with 15+ endpoints
- **Dependencies**: jQuery, Cookies.js, Bootstrap CSS
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

---

## Support & Documentation

- **Full Guide:** `ADMIN_DASHBOARD_GUIDE.md`
- **Quick Start:** `ADMIN_QUICK_START.md`
- **Server Endpoints:** See server.js lines 510-820
- **File Locations:** All JSON data files in root directory

---

## Next Steps

1. ✅ **Access admin dashboard** at `http://localhost:3000/admin-users.html`
2. ✅ **Test balance updates** for a user
3. ✅ **Approve/reject** test deposits
4. ✅ **Add admin links** to your main pages
5. ✅ **Implement authentication** (optional but recommended)
6. ✅ **Set up logging** for audit trail
7. ✅ **Deploy to production** when ready

---

**Status:** Ready to Use | **Last Updated:** 2024 | **Support:** See documentation files
