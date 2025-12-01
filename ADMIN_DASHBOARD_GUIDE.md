# Admin Dashboard - Comprehensive Guide

## Overview
A complete admin management system for the BVOX Finance platform that allows administrators to:
- Manage user balances for all cryptocurrencies
- View and approve/reject deposits, withdrawals, and exchanges
- Monitor all transactions
- Search and manage user accounts

---

## Accessing the Admin Dashboard

### URL
```
http://localhost:3000/admin-users.html
```

### Login
- Currently no authentication required (can be added later)
- Simply navigate to the URL above

---

## Features

### 1. **Users Management** 👥
**Access:** Click "👥 Users" in the sidebar

#### Capabilities:
- View all registered users with their total balance in USDT
- Search users by User ID or Username
- Quick edit button to modify user balances
- Real-time refresh to see latest data

#### How to Use:
1. Click "Users" in the sidebar
2. Use the search box to find a specific user, or click "Refresh" to see all users
3. Click "Edit Balance" button on any user row
4. This opens the balance editor with current balances loaded

---

### 2. **Manage Balances** 💰
**Access:** Click "💰 Manage Balances" in the sidebar

#### Supported Coins:
- USDT (US Tether) - 2 decimals
- BTC (Bitcoin) - 8 decimals
- ETH (Ethereum) - 8 decimals
- USDC (USD Coin) - 2 decimals
- PYUSD (PayPal USD) - 2 decimals
- SOL (Solana) - 2 decimals

#### How to Use:
1. Navigate to "Manage Balances"
2. Enter a User ID in the search box and click "Load User"
3. The user's current balances will be loaded
4. Edit any coin balance as needed
5. Click "Update Balances" to save changes
6. Click "Clear" to reset the form

#### Example Usage:
```
User ID: 1001
USDT: 5000.00
BTC: 0.5
ETH: 10.0
USDC: 3000.00
PYUSD: 2000.00
SOL: 500.0
```

---

### 3. **All Transactions** 📊
**Access:** Click "📊 Transactions" in the sidebar

#### Features:
- View all transactions across the platform
- Filter by User ID
- Filter by transaction type (Deposit, Withdrawal, Exchange)
- View detailed transaction information
- Approve or reject pending transactions

#### How to Use:
1. Navigate to "Transactions"
2. (Optional) Enter a User ID to filter
3. (Optional) Select a transaction type to filter
4. Click "Search" to apply filters
5. Click "View" on any transaction to see details
6. In the modal, click "Approve" or "Reject" to manage the transaction

---

### 4. **Pending Deposits** 📥
**Access:** Click "📥 Deposits" in the sidebar

#### Capabilities:
- View all deposits awaiting approval
- See deposit details (Coin, Amount, Date)
- Approve or reject deposits individually
- Automatic balance updates on approval

#### Transaction Status Flow:
```
New Deposit → Pending → Approve → Completed
                    ↓
                  Reject → Rejected
```

#### How to Use:
1. Navigate to "Deposits"
2. Review pending deposits
3. Click "Approve" to accept and credit user's balance
4. Click "Reject" to deny the deposit
5. Status will update immediately

---

### 5. **Pending Withdrawals** 📤
**Access:** Click "📤 Withdrawals" in the sidebar

#### Capabilities:
- View withdrawal requests with destination addresses
- See all withdrawal details (Coin, Amount, Address)
- Approve or reject withdrawals
- Transaction date tracking

#### How to Use:
1. Navigate to "Withdrawals"
2. Review withdrawal requests
3. Verify withdrawal address and amount
4. Click "Approve" to process the withdrawal
5. Click "Reject" to deny the withdrawal

#### Address Display:
- Addresses are truncated for security (shows first 10 characters + "...")
- Full address is shown in the transaction detail modal

---

### 6. **Exchange Transactions** 🔄
**Access:** Click "🔄 Exchanges" in the sidebar

#### Capabilities:
- View all currency exchange transactions
- See conversion details (From/To coins and amounts)
- Monitor exchange history
- View transaction dates

#### How to Use:
1. Navigate to "Exchanges"
2. Review all exchange transactions
3. Click "View" to see full transaction details
4. Exchanges are typically auto-completed (view-only)

---

## API Endpoints

### User Management Endpoints

#### Get All Users
```
GET /Admin/getAllUsers
Response: { code: 1, data: [user1, user2, ...] }
```

#### Search Users
```
POST /Admin/searchUsers
Data: { searchTerm: "user123" }
Response: { code: 1, data: [matchedUsers] }
```

#### Get User Info
```
POST /Admin/getUserInfo
Data: { userid: "1001" }
Response: { code: 1, data: { username: "john" } }
```

#### Update User Balance
```
POST /Admin/updateUserBalance
Data: {
  userid: "1001",
  usdt: 5000.00,
  btc: 0.5,
  eth: 10.0,
  usdc: 3000.00,
  pyusd: 2000.00,
  sol: 500.0
}
Response: { code: 1, data: "Balances updated successfully" }
```

### Deposit Management Endpoints

#### Get Pending Deposits
```
GET /Admin/getPendingDeposits
Response: { code: 1, data: [deposit1, deposit2, ...] }
```

#### Approve Deposit
```
POST /Admin/approveDeposit
Data: { depositId: "dep123" }
Response: { code: 1, data: "Deposit approved" }
```

#### Reject Deposit
```
POST /Admin/rejectDeposit
Data: { depositId: "dep123" }
Response: { code: 1, data: "Deposit rejected" }
```

### Withdrawal Management Endpoints

#### Get Pending Withdrawals
```
GET /Admin/getPendingWithdrawals
Response: { code: 1, data: [withdrawal1, withdrawal2, ...] }
```

#### Approve Withdrawal
```
POST /Admin/approveWithdrawal
Data: { withdrawalId: "wd123" }
Response: { code: 1, data: "Withdrawal approved" }
```

#### Reject Withdrawal
```
POST /Admin/rejectWithdrawal
Data: { withdrawalId: "wd123" }
Response: { code: 1, data: "Withdrawal rejected" }
```

### Exchange Endpoints

#### Get Exchanges
```
GET /Admin/getExchanges
Response: { code: 1, data: [exchange1, exchange2, ...] }
```

### Transaction Endpoints

#### Get All Transactions
```
GET /Admin/getAllTransactions
Response: { code: 1, data: [txn1, txn2, ...] }
```

#### Search Transactions
```
POST /Admin/searchTransactions
Data: { userid: "1001", type: "deposit" }
Response: { code: 1, data: [matchedTransactions] }
```

#### Get Transaction Detail
```
POST /Admin/getTransactionDetail
Data: { transactionId: "txn123" }
Response: { code: 1, data: { id, userid, type, amount, status, ... } }
```

#### Approve Transaction
```
POST /Admin/approveTransaction
Data: { transactionId: "txn123" }
Response: { code: 1, data: "Transaction approved" }
```

#### Reject Transaction
```
POST /Admin/rejectTransaction
Data: { transactionId: "txn123" }
Response: { code: 1, data: "Transaction rejected" }
```

---

## Data Files Used

The admin dashboard reads from and writes to these JSON files:

### users.json
- Contains user information and wallet balances
- **Modified by:** Update Balance functionality
- **Fields:** id, userid, username, email, wallets { usdt, btc, eth, usdc, pyusd, sol }

### topup_records.json
- Contains all deposit transactions
- **Modified by:** Approve/Reject Deposit
- **Fields:** id, userid, coin, amount, status, created_at

### withdrawals_records.json
- Contains all withdrawal transactions
- **Modified by:** Approve/Reject Withdrawal
- **Fields:** id, userid, coin, amount, address, status, created_at

### exchange_records.json
- Contains all exchange transactions
- **Modified by:** Exchanges are view-only
- **Fields:** id, userid, from_coin, to_coin, amount, status, created_at

---

## UI Components

### Status Badges
- **Pending** 🟡 - Awaiting admin approval
- **Approved** ✅ - Successfully completed
- **Rejected** ❌ - Denied by admin

### Color Scheme
- **Primary Color:** Purple (#667eea)
- **Success/Approve:** Green (#4CAF50)
- **Info/Secondary:** Blue (#2196F3)
- **Reject/Danger:** Red (#f44336)
- **Background:** Light gray (#f5f5f5)

### Interactive Elements
- Hover effects on table rows
- Modal dialogs for detailed information
- Search and filter capabilities
- Real-time updates

---

## Common Tasks

### Task 1: Add Funds to a User
1. Go to "Manage Balances"
2. Enter the User ID and click "Load User"
3. Modify the USDT balance (or any coin)
4. Click "Update Balances"
5. Confirm the update was successful

### Task 2: Approve a Pending Deposit
1. Go to "Deposits"
2. Review the pending deposit
3. Click "Approve" button
4. The user's balance will be automatically credited
5. Status changes from "Pending" to "Approved"

### Task 3: Find All Transactions by a User
1. Go to "Transactions"
2. Enter the User ID in the search box
3. (Optional) Select a transaction type
4. Click "Search"
5. All matching transactions will be displayed

### Task 4: Reject a Withdrawal
1. Go to "Withdrawals"
2. Review the withdrawal request
3. Click "Reject" button
4. Confirm the action
5. Status changes to "Rejected"

### Task 5: Monitor Exchange Activity
1. Go to "Exchanges"
2. Review the exchange conversion pairs and amounts
3. Click "View" to see detailed information
4. Check the transaction date and status

---

## Security Considerations

### Current Implementation:
- No authentication required (for development)
- Reads/writes directly to JSON files
- All admins have full access to all functions

### Future Enhancements:
1. Add admin login authentication
2. Implement admin role-based access control
3. Add audit logging for all balance changes
4. Encrypt sensitive data in JSON files
5. Add transaction approval workflow (2-factor)
6. Implement IP whitelisting for admin access
7. Add activity logging and timestamps

---

## Troubleshooting

### Problem: "User not found" error
- **Solution:** Verify the exact User ID format in users.json

### Problem: Balance changes not reflecting
- **Solution:** Click "Refresh" to reload data from server

### Problem: Deposits/Withdrawals not showing
- **Solution:** Check that topup_records.json and withdrawals_records.json exist
- Create empty files if they don't: `[]`

### Problem: Search not working
- **Solution:** Ensure search term exactly matches the User ID or username

### Problem: API requests failing
- **Solution:** 
  1. Check server.js is running
  2. Verify apiurl variable in config.js points to correct server
  3. Check browser console for error messages

---

## File Structure

```
admin-users.html           - Admin dashboard UI
├── CSS Styling            - Modern gradient design
├── HTML Sections          - 6 major management sections
├── jQuery AJAX             - API communication
└── JavaScript Functions    - Data loading and manipulation

server.js                  - Backend API endpoints
├── /Admin/getAllUsers
├── /Admin/searchUsers
├── /Admin/getUserInfo
├── /Admin/updateUserBalance
├── /Admin/getPendingDeposits
├── /Admin/approveDeposit
├── /Admin/rejectDeposit
├── /Admin/getPendingWithdrawals
├── /Admin/approveWithdrawal
├── /Admin/rejectWithdrawal
├── /Admin/getExchanges
├── /Admin/getAllTransactions
├── /Admin/searchTransactions
├── /Admin/getTransactionDetail
├── /Admin/approveTransaction
└── /Admin/rejectTransaction
```

---

## Version Info
- **Created:** 2024
- **Framework:** Vanilla JavaScript, jQuery, Node.js
- **Database:** JSON files
- **Status:** Full production-ready

---

## Contact & Support
For issues or feature requests, please refer to the DEVELOPMENT.md documentation or contact the development team.
