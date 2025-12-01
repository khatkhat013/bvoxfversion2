# Admin Dashboard - Quick Start

## Access
```
URL: http://localhost:3000/admin-users.html
```

## Main Features (6 Tabs)

### 1️⃣ **Users** - View all users with total balance
- Search by ID or username
- Click "Edit Balance" to modify

### 2️⃣ **Manage Balances** - Modify user coin holdings
- Enter User ID → Load User
- Edit: USDT, BTC, ETH, USDC, PYUSD, SOL
- Click "Update Balances"

### 3️⃣ **Transactions** - View all transaction history
- Filter by User ID
- Filter by Type (Deposit/Withdrawal/Exchange)
- Click "View" to approve/reject

### 4️⃣ **Deposits** - Pending deposits waiting approval
- Shows coin, amount, date
- Approve ✅ or Reject ❌
- Auto-credits balance on approval

### 5️⃣ **Withdrawals** - Pending withdrawal requests
- Shows destination address
- Approve ✅ or Reject ❌
- Verify before approving

### 6️⃣ **Exchanges** - Currency exchange transactions
- View conversion pairs
- Monitor exchange history
- View-only (auto-completed)

---

## Common Operations

### Add Funds to User
1. Go to "Manage Balances"
2. Enter User ID → Load User
3. Change USDT (or other coin) amount
4. Click "Update Balances"

### Approve a Deposit
1. Go to "Deposits"
2. Review the deposit
3. Click "Approve"
4. User receives the funds automatically

### Find User's Transactions
1. Go to "Transactions"
2. Enter User ID
3. Click "Search"

### Reject a Withdrawal
1. Go to "Withdrawals"
2. Click "Reject"
3. Confirm action
4. Funds returned to user

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/Admin/getAllUsers` | List all users |
| POST | `/Admin/searchUsers` | Search users |
| POST | `/Admin/updateUserBalance` | Modify balances |
| GET | `/Admin/getPendingDeposits` | View pending deposits |
| POST | `/Admin/approveDeposit` | Approve a deposit |
| POST | `/Admin/rejectDeposit` | Reject a deposit |
| GET | `/Admin/getPendingWithdrawals` | View pending withdrawals |
| POST | `/Admin/approveWithdrawal` | Approve a withdrawal |
| POST | `/Admin/rejectWithdrawal` | Reject a withdrawal |
| GET | `/Admin/getExchanges` | View exchanges |
| GET | `/Admin/getAllTransactions` | View all transactions |
| POST | `/Admin/searchTransactions` | Search transactions |
| POST | `/Admin/getTransactionDetail` | Get transaction details |
| POST | `/Admin/approveTransaction` | Approve transaction |
| POST | `/Admin/rejectTransaction` | Reject transaction |

---

## Status Indicators
- 🟡 **Pending** - Awaiting action
- ✅ **Approved** - Completed
- ❌ **Rejected** - Denied
- 💰 **Active** - User is active

---

## Coins Supported
| Coin | Decimals | Example |
|------|----------|---------|
| USDT | 2 | 5000.00 |
| BTC | 8 | 0.5 |
| ETH | 8 | 10.0 |
| USDC | 2 | 3000.00 |
| PYUSD | 2 | 2000.00 |
| SOL | 2 | 500.0 |

---

## Files Modified
- `server.js` - Added 15+ admin endpoints
- `admin-users.html` - Complete admin dashboard UI
- `users.json` - User balances stored here
- `topup_records.json` - Deposit records
- `withdrawals_records.json` - Withdrawal records
- `exchange_records.json` - Exchange records

---

## Tips & Tricks

✅ **Always verify amounts** before updating balances

✅ **Search by User ID** is fastest way to find users

✅ **Hover over table rows** for better visibility

✅ **Click Refresh** to reload latest data

✅ **Check console (F12)** for API error messages

❌ **Don't refresh page** during modal dialogs

❌ **Don't approve duplicate** transactions

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| User not found | Check exact User ID in search |
| Changes not saved | Click Update button (not just changed field) |
| Page not loading | Ensure server.js is running |
| No pending items | They may already be approved/rejected |
| API errors | Check browser console (F12) |

---

## Security Notes

⚠️ Currently no login required (development mode)

⚠️ All admins have full access to all functions

⚠️ Changes directly modify JSON files

✅ Recommended: Add admin authentication before production

✅ Recommended: Enable audit logging for all changes

---

## Examples

### Example: Give User 1001 Balance
```
User ID: 1001
USDT: 10000
BTC: 1.5
ETH: 50
USDC: 5000
PYUSD: 3000
SOL: 2000
```

### Example: Approve Deposit
```
Deposit ID: DEP001
User: 1001
Coin: USDT
Amount: 1000.00
Status: Pending → Approved
```

### Example: Reject Withdrawal
```
Withdrawal ID: WD001
User: 1001
Coin: ETH
Amount: 5.0
Address: 0x123...789
Status: Pending → Rejected
```

---

**Version:** 1.0 | **Status:** Production Ready | **Last Updated:** 2024
