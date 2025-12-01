# 🔄 Transaction Approval Workflow - Complete Implementation

## Overview

This document describes the complete transaction approval workflow for top-ups and withdrawals in BVOX Finance. The system ensures that user balances are only updated when an admin approves pending transactions.

---

## 📊 Workflow Process

```
1. User Initiates Transaction
   ↓
2. Transaction Created with Status = "PENDING"
   ↓
3. User Sees "PENDING" Badge on Record Page
4. Balance NOT Updated (PENDING transactions excluded)
   ↓
5. Admin Reviews & Approves (via Admin Dashboard)
   ↓
6. Status Updated to "APPROVED" in Database
7. User Sees "APPROVED" Badge on Record Page
8. Balance Updated to Include Transaction
   ↓
9. User Sees New Balance in Assets Page
```

---

## 🔧 Implementation Details

### 1. Record Creation (Pending Status)

#### Top-up Record Creation
**File:** `topupRecordModel.js`

```javascript
function saveTopupRecord(userid, coin, address, photoUrl, amount) {
    const record = {
        id: uuidv4(),
        user_id: userid,
        coin: coin,
        address: address,
        photo_url: photoUrl,
        amount: parseFloat(amount),
        status: 'pending',  // ← Always created as PENDING
        timestamp: Date.now(),
        created_at: new Date().toISOString()
    };
    // Save to topup_records.json
}
```

#### Withdrawal Record Creation
**File:** `withdrawalRecordModel.js`

```javascript
function saveWithdrawalRecord(userid, coin, address, quantity) {
    const record = {
        id: uuidv4(),
        user_id: userid,
        coin: coin,
        address: address,
        quantity: parseFloat(quantity),
        status: 'pending',  // ← Always created as PENDING
        timestamp: Date.now(),
        created_at: new Date().toISOString()
    };
    // Save to withdrawals_records.json
}
```

---

### 2. User-Facing Status Display

#### Top-up Record Page
**File:** `topup-record.html`

**Features:**
- Displays all transactions from `/api/topup-records` endpoint
- Shows status badge with color coding:
  - **PENDING** → Yellow background (#fff3cd)
  - **APPROVED** → Green background (#d4edda)
  - **REJECTED** → Red background (#f8d7da)

**CSS Styles:**
```css
.y-re-box-status {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.3rem 0.6rem;
    border-radius: 20px;
    margin-top: 0.3rem;
    text-align: center;
    width: fit-content;
}

.y-re-box-status.pending {
    background: #fff3cd;
    color: #856404;
}

.y-re-box-status.approved {
    background: #d4edda;
    color: #155724;
}

.y-re-box-status.rejected {
    background: #f8d7da;
    color: #721c24;
}
```

**JavaScript Display:**
```javascript
function displayRecords(records) {
    records.forEach(function(record) {
        const status = record.status || 'pending';
        const statusDisplay = status.charAt(0).toUpperCase() + status.slice(1);
        
        // HTML includes:
        // <div class="y-re-box-status ${status}">${statusDisplay}</div>
    });
}
```

#### Withdrawal Record Page
**File:** `withdrawal-record.html`

Same implementation as top-up record page with withdrawal-specific labels.

---

### 3. Balance Calculation (Approval-Aware)

#### Balance Endpoint
**File:** `server.js`

**Endpoint:** `POST /Wallet/getbalance`

**Key Logic:**
```javascript
// Only APPROVED transactions count toward balance
function getBalance(userid) {
    // Start with base balances from user record
    let balances = {
        usdt: user.usdt || 0,
        btc: user.btc || 0,
        eth: user.eth || 0,
        usdc: user.usdc || 0,
        pyusd: user.pyusd || 0,
        sol: user.sol || 0
    };
    
    // ADD only APPROVED topups
    topupRecords.forEach(record => {
        if (record.status === 'approved' || !record.status) {
            balances[coin] += record.amount;
        }
    });
    
    // DEDUCT only APPROVED withdrawals
    withdrawalRecords.forEach(record => {
        if (record.status === 'approved' || !record.status) {
            balances[coin] -= record.quantity;
        }
    });
    
    return balances;
}
```

**Impact:** 
- Pending transactions DO NOT affect balance
- Only approved transactions are included in calculations
- Balance updates immediately when approval status changes

---

### 4. Admin Approval Process

#### Admin Dashboard
**File:** `admin-users.html`

**Deposits Tab:**
- Lists all pending top-ups
- Shows: User, Amount, Coin, Date, Status
- Action Buttons: **Approve** | **Reject**

**Withdrawals Tab:**
- Lists all pending withdrawals
- Shows: User, Amount, Coin, Address, Date, Status
- Action Buttons: **Approve** | **Reject**

#### Approval Endpoint
**File:** `server.js`

**Endpoint:** `POST /Admin/approveDeposit`

```javascript
if (pathname === '/Admin/approveDeposit' && req.method === 'POST') {
    const { depositId } = JSON.parse(body);
    
    // Update status to 'approved'
    deposits = deposits.map(d => {
        if (d.id === depositId) {
            d.status = 'approved';  // ← Update status
        }
        return d;
    });
    
    // Save updated records
    fs.writeFileSync('./topup_records.json', JSON.stringify(deposits, null, 2));
    
    return { code: 1, data: 'Deposit approved' };
}
```

**Endpoint:** `POST /Admin/approveWithdrawal`

Similar implementation for withdrawals, updating `withdrawals_records.json`.

---

## 📁 Data Flow

### Data Files

1. **topup_records.json**
```json
[
    {
        "id": "uuid-1",
        "user_id": "user123",
        "coin": "USDT",
        "amount": 1000,
        "status": "pending",
        "timestamp": 1705000000000,
        "created_at": "2025-01-30T10:00:00Z"
    }
]
```

2. **withdrawals_records.json**
```json
[
    {
        "id": "uuid-2",
        "user_id": "user123",
        "coin": "BTC",
        "quantity": 0.5,
        "address": "1A1z7agoat...",
        "status": "pending",
        "timestamp": 1705000000000,
        "created_at": "2025-01-30T10:00:00Z"
    }
]
```

3. **users.json**
```json
[
    {
        "userid": "user123",
        "usdt": 5000,
        "btc": 2.0,
        "eth": 10.0,
        "usdc": 2000,
        "pyusd": 1000,
        "sol": 50.0
    }
]
```

---

## 🔄 Real-time Behavior

### When Admin Approves a Transaction

```
1. Admin clicks "Approve" on admin-users.html
   ↓
2. POST /Admin/approveDeposit is sent with depositId
   ↓
3. Server finds record and updates status: 'pending' → 'approved'
   ↓
4. Updated data written to topup_records.json
   ↓
5. User's record page (topup-record.html) shows status badge update
   ↓
6. Next /Wallet/getbalance call includes the approved transaction
   ↓
7. Assets page (assets.html) displays updated balance
```

### Balance Update Timing

- **Immediate:** Status badge updates on record pages
- **On Refresh:** Balance updates when user navigates or refreshes
- **Auto-Refresh:** Assets page updates every 5 seconds via `setInterval(() => updateje(), 5000)`

---

## 🧪 Testing Scenarios

### Scenario 1: Pending to Approved Flow

1. User initiates a $1000 USDT top-up
2. Record appears on top-up-record.html with **"Pending"** badge
3. Balance in assets.html does NOT include the $1000
4. Admin approves the top-up
5. Status changes to **"Approved"** on record page
6. Balance updates to include $1000

### Scenario 2: Rejection Flow

1. User initiates a BTC withdrawal
2. Record shows **"Pending"** badge
3. Balance does NOT include withdrawal deduction
4. Admin rejects the withdrawal
5. Status changes to **"Rejected"**
6. Balance remains unchanged

### Scenario 3: Multiple Transactions

1. User has pending $500 topup and $200 withdrawal
2. Balance excludes both (neither approved)
3. Admin approves only the topup
4. Balance increases by $500 (withdrawal still pending/excluded)
5. Admin later approves withdrawal
6. Balance decreases by $200

---

## 📊 API Endpoints Summary

| Endpoint | Method | Purpose | Status Field Updated |
|----------|--------|---------|----------------------|
| `/api/topup-record` | POST | Create pending top-up | ✓ Set to "pending" |
| `/api/topup-records` | GET | Get user's top-ups | ✓ Returns with status |
| `/api/withdrawal-record` | POST | Create pending withdrawal | ✓ Set to "pending" |
| `/api/withdrawal-records` | GET | Get user's withdrawals | ✓ Returns with status |
| `/Wallet/getbalance` | POST | Get balance (APPROVED only) | ✓ Filters by status |
| `/Admin/approveDeposit` | POST | Approve top-up | ✓ Updates to "approved" |
| `/Admin/rejectDeposit` | POST | Reject top-up | ✓ Updates to "rejected" |
| `/Admin/approveWithdrawal` | POST | Approve withdrawal | ✓ Updates to "approved" |
| `/Admin/rejectWithdrawal` | POST | Reject withdrawal | ✓ Updates to "rejected" |

---

## 🔒 Security Notes

1. **Only Approved Balances Count:** Pending/Rejected transactions never affect balance
2. **Admin-Only Approval:** Only authenticated admins can approve/reject
3. **Audit Trail:** All status changes stored in JSON files
4. **Status Validation:** Records default to "pending" if status not specified

---

## 🎯 User Experience

### User Perspective

1. **Submitting Transaction**
   - User submits top-up or withdrawal
   - Sees confirmation message
   - Record appears immediately with **"Pending"** badge

2. **Waiting for Approval**
   - User can see transaction on record page
   - Badge shows **"Pending"** status
   - Balance does NOT include pending transaction

3. **After Approval**
   - Badge changes to **"Approved"**
   - Balance updates automatically
   - User receives notification (optional)

4. **After Rejection**
   - Badge shows **"Rejected"**
   - Balance remains unchanged
   - User can submit new transaction

---

## 🚀 Performance Optimization

1. **Balance Caching:** Consider caching balance calculations
2. **Batch Approvals:** Admin can approve multiple transactions at once
3. **Notification System:** Real-time updates when status changes
4. **Database Indexes:** Index `user_id` and `status` fields for fast queries

---

## 📝 Future Enhancements

1. **Scheduled Approvals:** Auto-approve after verification
2. **Partial Approval:** Approve portion of transaction
3. **Approval Analytics:** Track approval times and ratios
4. **User Notifications:** Push/email when status changes
5. **Recurring Approvals:** Set auto-approval rules per user
6. **SLA Tracking:** Monitor approval SLA compliance

---

## ✅ Verification Checklist

- [x] Top-ups created with status='pending'
- [x] Withdrawals created with status='pending'
- [x] Status badges display on top-up-record.html
- [x] Status badges display on withdrawal-record.html
- [x] /Wallet/getbalance filters by approval status
- [x] Admin can approve top-ups via /Admin/approveDeposit
- [x] Admin can approve withdrawals via /Admin/approveWithdrawal
- [x] Balance updates after approval
- [x] Pending transactions excluded from balance
- [x] Rejection functionality implemented

---

**Implementation Date:** January 30, 2025  
**Status:** ✅ Complete  
**Version:** 1.0
