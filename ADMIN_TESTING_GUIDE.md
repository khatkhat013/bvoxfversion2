# Testing Commands & cURL Examples

## Quick Test Commands

### 1. Get All Users
```bash
curl -X GET http://localhost:3000/Admin/getAllUsers
```

**Expected Response:**
```json
{
  "code": 1,
  "data": [
    {
      "id": "1",
      "userid": "1",
      "username": "testuser",
      "email": "test@example.com",
      "total_balance": 15000
    }
  ]
}
```

---

### 2. Search Users
```bash
curl -X POST http://localhost:3000/Admin/searchUsers \
  -H "Content-Type: application/json" \
  -d '{"searchTerm": "1"}'
```

---

### 3. Get User Info
```bash
curl -X POST http://localhost:3000/Admin/getUserInfo \
  -H "Content-Type: application/json" \
  -d '{"userid": "1"}'
```

---

### 4. Update User Balance - Add 5000 USDT
```bash
curl -X POST http://localhost:3000/Admin/updateUserBalance \
  -H "Content-Type: application/json" \
  -d '{
    "userid": "1",
    "usdt": 5000,
    "btc": 0,
    "eth": 0,
    "usdc": 0,
    "pyusd": 0,
    "sol": 0
  }'
```

---

### 5. Get Pending Deposits
```bash
curl -X GET http://localhost:3000/Admin/getPendingDeposits
```

---

### 6. Approve a Deposit
```bash
curl -X POST http://localhost:3000/Admin/approveDeposit \
  -H "Content-Type: application/json" \
  -d '{"depositId": "dep123"}'
```

---

### 7. Reject a Deposit
```bash
curl -X POST http://localhost:3000/Admin/rejectDeposit \
  -H "Content-Type: application/json" \
  -d '{"depositId": "dep123"}'
```

---

### 8. Get Pending Withdrawals
```bash
curl -X GET http://localhost:3000/Admin/getPendingWithdrawals
```

---

### 9. Approve a Withdrawal
```bash
curl -X POST http://localhost:3000/Admin/approveWithdrawal \
  -H "Content-Type: application/json" \
  -d '{"withdrawalId": "wd123"}'
```

---

### 10. Reject a Withdrawal
```bash
curl -X POST http://localhost:3000/Admin/rejectWithdrawal \
  -H "Content-Type: application/json" \
  -d '{"withdrawalId": "wd123"}'
```

---

### 11. Get Exchanges
```bash
curl -X GET http://localhost:3000/Admin/getExchanges
```

---

### 12. Get All Transactions
```bash
curl -X GET http://localhost:3000/Admin/getAllTransactions
```

---

### 13. Search Transactions
```bash
curl -X POST http://localhost:3000/Admin/searchTransactions \
  -H "Content-Type: application/json" \
  -d '{"userid": "1", "type": "deposit"}'
```

---

### 14. Get Transaction Details
```bash
curl -X POST http://localhost:3000/Admin/getTransactionDetail \
  -H "Content-Type: application/json" \
  -d '{"transactionId": "txn123"}'
```

---

### 15. Approve Transaction
```bash
curl -X POST http://localhost:3000/Admin/approveTransaction \
  -H "Content-Type: application/json" \
  -d '{"transactionId": "txn123"}'
```

---

### 16. Reject Transaction
```bash
curl -X POST http://localhost:3000/Admin/rejectTransaction \
  -H "Content-Type: application/json" \
  -d '{"transactionId": "txn123"}'
```

---

## PowerShell Test Script

Save as `test-admin-api.ps1`:

```powershell
# Test Admin API Endpoints

$apiUrl = "http://localhost:3000"

# Test 1: Get All Users
Write-Host "Test 1: Get All Users"
$response = Invoke-RestMethod -Uri "$apiUrl/Admin/getAllUsers" -Method Get
Write-Host ($response | ConvertTo-Json) -ForegroundColor Green

# Test 2: Get Pending Deposits
Write-Host "`nTest 2: Get Pending Deposits"
$response = Invoke-RestMethod -Uri "$apiUrl/Admin/getPendingDeposits" -Method Get
Write-Host ($response | ConvertTo-Json) -ForegroundColor Green

# Test 3: Get Pending Withdrawals
Write-Host "`nTest 3: Get Pending Withdrawals"
$response = Invoke-RestMethod -Uri "$apiUrl/Admin/getPendingWithdrawals" -Method Get
Write-Host ($response | ConvertTo-Json) -ForegroundColor Green

# Test 4: Get All Transactions
Write-Host "`nTest 4: Get All Transactions"
$response = Invoke-RestMethod -Uri "$apiUrl/Admin/getAllTransactions" -Method Get
Write-Host ($response | ConvertTo-Json) -ForegroundColor Green

# Test 5: Update User Balance
Write-Host "`nTest 5: Update User Balance"
$body = @{
    userid = "1"
    usdt = 10000
    btc = 1
    eth = 20
    usdc = 5000
    pyusd = 3000
    sol = 1000
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$apiUrl/Admin/updateUserBalance" -Method Post `
  -Headers @{"Content-Type"="application/json"} -Body $body
Write-Host ($response | ConvertTo-Json) -ForegroundColor Green

Write-Host "`nAll tests completed!" -ForegroundColor Cyan
```

Run with:
```powershell
.\test-admin-api.ps1
```

---

## Browser Console Tests

Open browser console (F12) and run:

```javascript
// Get all users
$.get('http://localhost:3000/Admin/getAllUsers', function(data) {
  console.log('All Users:', data);
});

// Get pending deposits
$.get('http://localhost:3000/Admin/getPendingDeposits', function(data) {
  console.log('Pending Deposits:', data);
});

// Update user balance
$.post('http://localhost:3000/Admin/updateUserBalance', {
  userid: '1',
  usdt: 7500,
  btc: 0.75,
  eth: 15,
  usdc: 4000,
  pyusd: 2500,
  sol: 750
}, function(data) {
  console.log('Balance Updated:', data);
});

// Get transactions
$.get('http://localhost:3000/Admin/getAllTransactions', function(data) {
  console.log('All Transactions:', data);
});

// Search transactions
$.post('http://localhost:3000/Admin/searchTransactions', {
  userid: '1',
  type: 'deposit'
}, function(data) {
  console.log('Filtered Transactions:', data);
});
```

---

## Node.js Test Script

Save as `test-admin-api.js`:

```javascript
const http = require('http');

function apiCall(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  try {
    console.log('🧪 Testing Admin API Endpoints\n');

    // Test 1
    console.log('1️⃣  Get All Users');
    let result = await apiCall('GET', '/Admin/getAllUsers');
    console.log('✅ Response:', result.code === 1 ? 'SUCCESS' : 'FAILED');

    // Test 2
    console.log('\n2️⃣  Get Pending Deposits');
    result = await apiCall('GET', '/Admin/getPendingDeposits');
    console.log('✅ Response:', result.code === 1 ? 'SUCCESS' : 'FAILED');

    // Test 3
    console.log('\n3️⃣  Get Pending Withdrawals');
    result = await apiCall('GET', '/Admin/getPendingWithdrawals');
    console.log('✅ Response:', result.code === 1 ? 'SUCCESS' : 'FAILED');

    // Test 4
    console.log('\n4️⃣  Update User Balance');
    result = await apiCall('POST', '/Admin/updateUserBalance', {
      userid: '1',
      usdt: 8000,
      btc: 0.8,
      eth: 16,
      usdc: 4500,
      pyusd: 2700,
      sol: 800
    });
    console.log('✅ Response:', result.code === 1 ? 'SUCCESS' : 'FAILED');

    // Test 5
    console.log('\n5️⃣  Get All Transactions');
    result = await apiCall('GET', '/Admin/getAllTransactions');
    console.log('✅ Response:', result.code === 1 ? 'SUCCESS' : 'FAILED');

    console.log('\n✨ All tests completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
```

Run with:
```bash
node test-admin-api.js
```

---

## Manual UI Testing

### Scenario 1: Add Balance to User
1. Open http://localhost:3000/admin-users.html
2. Click "Manage Balances"
3. Enter User ID: `1`
4. Click "Load User"
5. Change USDT to `10000`
6. Click "Update Balances"
7. Verify success message
8. Check `users.json` file

### Scenario 2: Approve a Deposit
1. Create test deposit in `topup_records.json`:
```json
{
  "id": "test-dep-001",
  "userid": "1",
  "coin": "usdt",
  "amount": 1000,
  "status": "pending",
  "created_at": "2024-01-15T10:00:00Z"
}
```
2. Click "Deposits" tab
3. Click "Approve" on the test deposit
4. Verify status changed to "approved" in `topup_records.json`

### Scenario 3: Search Users
1. Click "Users" tab
2. Enter `1` in search box
3. Click "Search"
4. Verify results show matching users

### Scenario 4: View Transaction Details
1. Click "Transactions" tab
2. Click "View" on any transaction
3. Modal opens with details
4. Try "Approve" or "Reject"
5. Modal closes and list refreshes

---

## Performance Testing

### Load Test - Get Users (1000 calls)
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:3000/Admin/getAllUsers
```

### Stress Test - Update Balance
```bash
# Using wrk (if installed)
wrk -t12 -c400 -d30s http://localhost:3000/Admin/getAllUsers
```

---

## Data Validation Tests

### Test: Invalid User ID
```bash
curl -X POST http://localhost:3000/Admin/getUserInfo \
  -H "Content-Type: application/json" \
  -d '{"userid": "invalid"}'
```
Expected: `{"code": 0, "data": "User not found"}`

### Test: Missing Required Fields
```bash
curl -X POST http://localhost:3000/Admin/updateUserBalance \
  -H "Content-Type: application/json" \
  -d '{"userid": "1"}'
```
Expected: Error or validation message

### Test: Invalid Balance Amount
```bash
curl -X POST http://localhost:3000/Admin/updateUserBalance \
  -H "Content-Type: application/json" \
  -d '{"userid": "1", "usdt": "abc"}'
```
Expected: Should handle gracefully (convert or error)

---

## Debugging Tips

### Check Server Logs
```bash
# If running in terminal
# Look for [Admin] messages in console output
```

### Monitor File Changes
```bash
# PowerShell - watch users.json
while(1) { 
  Get-ChildItem users.json | Select LastWriteTime
  Start-Sleep 2
}
```

### Check API Response Times
```javascript
console.time('admin-api');
$.get('/Admin/getAllUsers', () => console.timeEnd('admin-api'));
```

### Validate JSON Files
```bash
# PowerShell
(Get-Content users.json) | ConvertFrom-Json | Out-Null
Write-Host "users.json is valid JSON"
```

---

## Test Data Creation

### Create Test User
Add to `users.json`:
```json
{
  "id": "test-001",
  "userid": "test-001",
  "username": "testuser",
  "email": "test@example.com",
  "wallets": {
    "usdt": 5000,
    "btc": 0.5,
    "eth": 10,
    "usdc": 3000,
    "pyusd": 2000,
    "sol": 500
  }
}
```

### Create Test Deposit
Add to `topup_records.json`:
```json
{
  "id": "test-dep-001",
  "userid": "test-001",
  "coin": "usdt",
  "amount": 1000,
  "status": "pending",
  "created_at": "2024-01-15T10:00:00Z"
}
```

### Create Test Withdrawal
Add to `withdrawals_records.json`:
```json
{
  "id": "test-wd-001",
  "userid": "test-001",
  "coin": "eth",
  "amount": 5,
  "address": "0x1234567890123456789012345678901234567890",
  "status": "pending",
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

## Automated Test Suite

Create `admin-tests.spec.js` for Jest:

```javascript
describe('Admin API Endpoints', () => {
  const API_URL = 'http://localhost:3000';

  test('GET /Admin/getAllUsers returns users', async () => {
    const res = await fetch(`${API_URL}/Admin/getAllUsers`);
    const data = await res.json();
    expect(data.code).toBe(1);
    expect(Array.isArray(data.data)).toBe(true);
  });

  test('POST /Admin/updateUserBalance updates balance', async () => {
    const res = await fetch(`${API_URL}/Admin/updateUserBalance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userid: '1',
        usdt: 5000,
        btc: 0,
        eth: 0,
        usdc: 0,
        pyusd: 0,
        sol: 0
      })
    });
    const data = await res.json();
    expect(data.code).toBe(1);
  });

  test('GET /Admin/getPendingDeposits returns deposits', async () => {
    const res = await fetch(`${API_URL}/Admin/getPendingDeposits`);
    const data = await res.json();
    expect(data.code).toBe(1);
    expect(Array.isArray(data.data)).toBe(true);
  });
});
```

Run with:
```bash
jest admin-tests.spec.js
```

---

## Checklist for Complete Testing

- [ ] All 15+ endpoints respond
- [ ] GET endpoints return 200 status
- [ ] POST endpoints accept JSON data
- [ ] Error handling works properly
- [ ] JSON files are persisted
- [ ] UI elements render correctly
- [ ] Search functionality works
- [ ] Approve/Reject actions update status
- [ ] Balance updates reflect in JSON
- [ ] No console errors
- [ ] Page responsive on mobile
- [ ] Modal dialogs work correctly
- [ ] Sorting/filtering works
- [ ] Real-time updates work
- [ ] Performance is acceptable

---

**Version:** 1.0 | **Status:** Ready to Test | **Last Updated:** 2024
