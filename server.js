/**
 * Simple Development Server for BVOX Finance
 * Serves static files and handles CORS
 * 
 * Usage: node server.js
 */

// Global error handlers to catch unhandled rejections BEFORE anything else
process.on('unhandledRejection', (reason, promise) => {
    console.error('[UNHANDLED REJECTION]', reason);
    if (reason && reason.stack) {
        console.error('[STACK]', reason.stack);
    }
});

process.on('uncaughtException', (error) => {
    console.error('[UNCAUGHT EXCEPTION]', error.message);
    console.error('[STACK]', error.stack);
    // Don't exit - let server continue
});

// Prevent accidental process exits
const originalExit = process.exit;
process.exit = function(code) {
    console.warn('[WARNING] process.exit() called with code:', code);
    console.warn('[STACK]', new Error().stack);
    // Comment out to prevent exit
    // originalExit(code);
};

const http = require('http');
const { runAsync, getAsync, allAsync } = require('./db-config-mysql');
const { registerUser } = require('./userModel');
const { saveTopupRecord, getUserTopupRecords, getAllTopupRecords } = require('./topupRecordModel');
const { saveWithdrawalRecord, getUserWithdrawalRecords } = require('./withdrawalRecordModel');
const { saveExchangeRecord, getUserExchangeRecords } = require('./exchangeRecordModel');
const { getAllUsers, getUserById, updateUserBalance, getUserStats, addTopupRecord, addWithdrawalRecord, deleteTransaction } = require('./adminModel');
const { registerAdmin, loginAdmin, getAdminById, verifyToken } = require('./authModel');
const { getAllArbitrageProducts, getArbitrageProductById, createArbitrageSubscription, getUserArbitrageSubscriptions, getUserArbitrageStats } = require('./arbitrageModel');
const { connectWallet, verifyWallet, getWalletByUID, getUserByUID, getWalletByAddress } = require('./walletModel');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.download': 'text/javascript', // .download files are typically JS
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

// Create HTTP Server
const server = http.createServer((req, res) => {
    try {
        // Parse the request URL first
        const parsedUrl = url.parse(req.url, true);
        let pathname = parsedUrl.pathname;

        // DEBUG: Log incoming requests for Admin endpoints
        if (pathname.startsWith('/Admin/')) {
            console.log(`[REQUEST] ${req.method} ${pathname} (full URL: ${req.url})`);
        }

        // Add CORS headers FIRST - before any other response
        const origin = req.headers.origin || '*';
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        // Handle user registration (wallet connect)
        if (pathname === '/api/register' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    // Extract fields from request
                    const address = data.address;
                    const session = data.session || uuidv4();
                    const token = data.token || uuidv4();
                    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    const user_agent = req.headers['user-agent'] || '';
                    if (!address) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Missing address' }));
                        return;
                    }
                    const user = registerUser({ address, session, token, ip, user_agent });
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, user }));
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid request', details: e.message }));
                }
            });
            return;
        }

    // Handle top-up record save (POST)
    if (pathname === '/api/topup-record' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                // Remove any query parameters appended by jQuery beforeSend
                // e.g., "&yanzheng=...", "&token=...", "&address=...", "&sid=..."
                let jsonBody = body;
                if (body.includes('}&')) {
                    // JSON ends at the first '}', extract it
                    jsonBody = body.substring(0, body.indexOf('}&') + 1);
                }
                
                console.error('[topup-record] Raw body:', body.substring(0, 200));
                console.error('[topup-record] Cleaned body:', jsonBody.substring(0, 200));
                
                const data = JSON.parse(jsonBody);
                console.error('[topup-record] ✓ Parsed:', JSON.stringify(data).substring(0, 100));
                const { user_id, coin, address, photo_url, amount } = data;
                
                if (!user_id || !coin || !address || !photo_url || !amount) {
                    console.error('[topup-record] ✗ Missing field');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }
                
                console.error('[topup-record] ✓ Saving record...');
                const record = saveTopupRecord({ user_id, coin, address, photo_url, amount });
                console.error('[topup-record] ✓ Saved:', record.id);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, record }));
            } catch (e) {
                console.error('[topup-record] ✗ Error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // Get user's top-up records (GET)
    if (pathname === '/api/topup-records' && req.method === 'GET') {
        const queryParams = url.parse(req.url, true).query;
        const user_id = queryParams.user_id;
        if (!user_id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing user_id parameter' }));
            return;
        }
        const records = getUserTopupRecords(user_id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, records }));
        return;
    }

    // Get all topup records (admin view)
    if (pathname === '/api/all-topup-records' && req.method === 'GET') {
        try {
            const records = getAllTopupRecords();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: records }));
        } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: [] }));
        }
        return;
    }

    // Handle withdrawal record save (POST)
    if (pathname === '/api/withdrawal-record' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                // Remove any query parameters appended by jQuery beforeSend
                let jsonBody = body;
                if (body.includes('}&')) {
                    jsonBody = body.substring(0, body.indexOf('}&') + 1);
                }
                
                console.error('[withdrawal-record] Raw body:', body.substring(0, 200));
                console.error('[withdrawal-record] Cleaned body:', jsonBody.substring(0, 200));
                
                const data = JSON.parse(jsonBody);
                console.error('[withdrawal-record] ✓ Parsed:', JSON.stringify(data).substring(0, 100));
                const { user_id, coin, address, quantity } = data;
                
                if (!user_id || !coin || !address || !quantity) {
                    console.error('[withdrawal-record] ✗ Missing field');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }
                
                console.error('[withdrawal-record] ✓ Saving record...');
                const record = saveWithdrawalRecord({ user_id, coin, address, quantity, status: 'pending' });
                console.error('[withdrawal-record] ✓ Saved:', record.id);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, record }));
            } catch (e) {
                console.error('[withdrawal-record] ✗ Error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // Get user's withdrawal records (GET)
    if (pathname === '/api/withdrawal-records' && req.method === 'GET') {
        const queryParams = url.parse(req.url, true).query;
        const user_id = queryParams.user_id;
        if (!user_id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing user_id parameter' }));
            return;
        }
        const records = getUserWithdrawalRecords(user_id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, records }));
        return;
    }

    // Handle exchange record save (POST)
    if (pathname === '/api/exchange-record' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                // Remove any query parameters appended by jQuery beforeSend
                let jsonBody = body;
                if (body.includes('}&')) {
                    jsonBody = body.substring(0, body.indexOf('}&') + 1);
                }
                
                console.error('[exchange-record] Raw body:', body.substring(0, 200));
                console.error('[exchange-record] Cleaned body:', jsonBody.substring(0, 200));
                
                const data = JSON.parse(jsonBody);
                console.error('[exchange-record] ✓ Parsed:', JSON.stringify(data).substring(0, 100));
                const { user_id, from_coin, to_coin, from_amount, to_amount, status } = data;
                
                if (!user_id || !from_coin || !to_coin || !from_amount || !to_amount) {
                    console.error('[exchange-record] ✗ Missing field');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }
                
                console.error('[exchange-record] ✓ Saving record...');
                const record = saveExchangeRecord({ user_id, from_coin, to_coin, from_amount, to_amount, status: status || 'completed' });
                console.error('[exchange-record] ✓ Saved:', record.id);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, record }));
            } catch (e) {
                console.error('[exchange-record] ✗ Error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // Get user's exchange records (GET)
    if (pathname === '/api/exchange-records' && req.method === 'GET') {
        const queryParams = url.parse(req.url, true).query;
        const user_id = queryParams.user_id;
        if (!user_id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing user_id parameter' }));
            return;
        }
        const records = getUserExchangeRecords(user_id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, records }));
        return;
    }

    // ADMIN AUTHENTICATION ENDPOINTS

    // Admin Login
    if (pathname === '/api/admin/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                let jsonBody = body;
                if (body.includes('}&')) {
                    jsonBody = body.substring(0, body.indexOf('}&') + 1);
                }

                const data = JSON.parse(jsonBody);
                const { username, password } = data;

                if (!username || !password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Username and password required' }));
                    return;
                }

                const result = loginAdmin(username, password);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, ...result }));
            } catch (e) {
                console.error('[admin-login] Error:', e.message);
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // Admin Register
    if (pathname === '/api/admin/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                let jsonBody = body;
                if (body.includes('}&')) {
                    jsonBody = body.substring(0, body.indexOf('}&') + 1);
                }

                const data = JSON.parse(jsonBody);
                const { fullname, username, email, password } = data;

                if (!fullname || !username || !email || !password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'All fields required' }));
                    return;
                }

                const admin = registerAdmin(fullname, username, email, password);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Admin registered successfully', admin: { id: admin.id, username: admin.username, email: admin.email } }));
            } catch (e) {
                console.error('[admin-register] Error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // ADMIN API ENDPOINTS
    
    // Get all users (admin)
    if (pathname === '/api/admin/users' && req.method === 'GET') {
        const users = getAllUsers();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, users }));
        return;
    }

    // Get user details and stats (admin)
    if (pathname === '/api/admin/user-stats' && req.method === 'GET') {
        const queryParams = url.parse(req.url, true).query;
        const userId = queryParams.user_id;
        
        if (!userId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing user_id parameter' }));
            return;
        }

        const user = getUserById(userId);
        const stats = getUserStats(userId);

        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User not found' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user, stats }));
        return;
    }

    // Update user balance (admin)
    if (pathname === '/api/admin/update-balance' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                let jsonBody = body;
                if (body.includes('}&')) {
                    jsonBody = body.substring(0, body.indexOf('}&') + 1);
                }

                const data = JSON.parse(jsonBody);
                const { user_id, coin, amount } = data;

                if (!user_id || !coin || amount === undefined) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }

                const updatedUser = updateUserBalance(user_id, coin, amount);

                if (!updatedUser) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'User not found' }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, user: updatedUser }));
            } catch (e) {
                console.error('[admin-update-balance] Error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // Add topup record for user (admin)
    if (pathname === '/api/admin/add-topup' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                let jsonBody = body;
                if (body.includes('}&')) {
                    jsonBody = body.substring(0, body.indexOf('}&') + 1);
                }

                const data = JSON.parse(jsonBody);
                const { user_id, coin, amount } = data;

                if (!user_id || !coin || !amount) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }

                const record = addTopupRecord(user_id, coin, amount);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, record }));
            } catch (e) {
                console.error('[admin-add-topup] Error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // Add withdrawal record for user (admin)
    if (pathname === '/api/admin/add-withdrawal' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                let jsonBody = body;
                if (body.includes('}&')) {
                    jsonBody = body.substring(0, body.indexOf('}&') + 1);
                }

                const data = JSON.parse(jsonBody);
                const { user_id, coin, address, quantity } = data;

                if (!user_id || !coin || !address || !quantity) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }

                const record = addWithdrawalRecord(user_id, coin, address, quantity);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, record }));
            } catch (e) {
                console.error('[admin-add-withdrawal] Error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // Delete transaction (admin)
    if (pathname === '/api/admin/delete-transaction' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                let jsonBody = body;
                if (body.includes('}&')) {
                    jsonBody = body.substring(0, body.indexOf('}&') + 1);
                }

                const data = JSON.parse(jsonBody);
                const { transaction_type, transaction_id } = data;

                if (!transaction_type || !transaction_id) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }

                const success = deleteTransaction(transaction_type, transaction_id);

                if (!success) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Transaction not found' }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Transaction deleted' }));
            } catch (e) {
                console.error('[admin-delete] Error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // NEW ADMIN MANAGEMENT ENDPOINTS (for admin-users.html)

    // Get all users with balances for admin
    if (pathname === '/Admin/getAllUsers' && req.method === 'GET') {
        try {
            const users = getAllUsers();
            const usersWithBalances = users.map(user => {
                const balances = user.wallets || {};
                const total_balance = (balances.usdt || 0) + (balances.eth || 0) * 1200 + (balances.btc || 0) * 25000 + (balances.usdc || 0) + (balances.pyusd || 0) + (balances.sol || 0) * 50;
                return {
                    id: user.id || user.userid,
                    userid: user.id || user.userid,
                    username: user.username || 'User',
                    email: user.email || 'N/A',
                    total_balance: total_balance
                };
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: usersWithBalances }));
        } catch (e) {
            console.error('[getAllUsers] Error:', e.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 0, data: 'Error fetching users' }));
        }
        return;
    }

    // Search users by ID or username
    if (pathname === '/Admin/searchUsers' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const searchTerm = data.searchTerm || '';
                const users = getAllUsers();
                const filtered = users.filter(user => {
                    const uid = (user.id || user.userid).toString();
                    const uname = (user.username || '').toLowerCase();
                    return uid.includes(searchTerm) || uname.includes(searchTerm.toLowerCase());
                });
                const result = filtered.map(user => ({
                    id: user.id || user.userid,
                    userid: user.id || user.userid,
                    username: user.username || 'User',
                    email: user.email || 'N/A'
                }));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 1, data: result }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 0, data: 'Error searching users' }));
            }
        });
        return;
    }

    // Get user info
    if (pathname === '/Admin/getUserInfo' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const userid = data.userid;
                const user = getUserById(userid);
                if (user) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 1, data: { username: user.username || 'User' } }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 0, data: 'User not found' }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 0, data: 'Error fetching user' }));
            }
        });
        return;
    }

    // Update user balance - all coins at once
    if (pathname === '/Admin/updateUserBalance' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const userid = data.userid;
                const balances = {
                    usdt: parseFloat(data.usdt) || 0,
                    btc: parseFloat(data.btc) || 0,
                    eth: parseFloat(data.eth) || 0,
                    usdc: parseFloat(data.usdc) || 0,
                    pyusd: parseFloat(data.pyusd) || 0,
                    sol: parseFloat(data.sol) || 0
                };

                // Update in users.json
                let users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
                let userFound = false;
                users = users.map(u => {
                    if ((u.id || u.userid).toString() === userid.toString()) {
                        u.wallets = balances;
                        userFound = true;
                    }
                    return u;
                });

                if (userFound) {
                    fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 1, data: 'Balances updated successfully' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 0, data: 'User not found' }));
                }
            } catch (e) {
                console.error('[updateUserBalance] Error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 0, data: 'Error updating balances: ' + e.message }));
            }
        });
        return;
    }

    // Get pending deposits
    if (pathname === '/Admin/getPendingDeposits' && req.method === 'GET') {
        try {
            const deposits = fs.existsSync('./topup_records.json') ? JSON.parse(fs.readFileSync('./topup_records.json', 'utf8')) : [];
            const pending = deposits.filter(d => d.status === 'pending' || d.status === 'processing');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: pending }));
        } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: [] }));
        }
        return;
    }

    // Get all deposits
    if (pathname === '/Admin/getAllDeposits' && req.method === 'GET') {
        try {
            const deposits = fs.existsSync('./topup_records.json') ? JSON.parse(fs.readFileSync('./topup_records.json', 'utf8')) : [];
            const sorted = deposits.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: sorted }));
        } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: [] }));
        }
        return;
    }

    // Approve deposit with MySQL
    if (pathname === '/Admin/approveDeposit' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            (async () => {
                try {
                    console.log('[Admin/approveDeposit] Request received');
                    let data = null;
                    try {
                        data = JSON.parse(body);
                    } catch (je) {
                        const params = {};
                        body.split('&').forEach(pair => {
                            const [k, v] = pair.split('=');
                            if (k) params[decodeURIComponent(k)] = decodeURIComponent((v || '').replace(/\+/g, ' '));
                        });
                        data = params;
                    }

                    const depositId = parseInt(data.depositId || data.depositid || data.id || data.deposit_id);
                    console.log('[Admin/approveDeposit] Deposit ID:', depositId);
                    
                    // Get deposit record
                    const deposit = await getAsync('SELECT * FROM topup_records WHERE id = ?', [depositId]);
                    console.log('[Admin/approveDeposit] Deposit record:', deposit);
                    
                    if (!deposit) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ code: 0, data: 'Deposit not found' }));
                        return;
                    }

                    const userId = deposit.user_id;
                    const coin = deposit.coin.toLowerCase();
                    const amount = parseFloat(deposit.amount) || 0;

                    console.log('[Admin/approveDeposit] Updating - UserId:', userId, 'Coin:', coin, 'Amount:', amount);

                    // Validate coin name
                    const validCoins = ['usdt', 'btc', 'eth', 'usdc', 'pyusd', 'sol'];
                    if (!validCoins.includes(coin)) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ code: 0, data: 'Invalid coin type' }));
                        return;
                    }

                    // Update deposit status to 'complete'
                    await runAsync('UPDATE topup_records SET status = ? WHERE id = ?', ['complete', depositId]);
                    console.log('[Admin/approveDeposit] Deposit status updated to complete');

                    // Update user balance using proper escaping
                    let updateQuery;
                    if (coin === 'usdt') updateQuery = 'UPDATE users SET usdt = usdt + ? WHERE userid = ?';
                    else if (coin === 'btc') updateQuery = 'UPDATE users SET btc = btc + ? WHERE userid = ?';
                    else if (coin === 'eth') updateQuery = 'UPDATE users SET eth = eth + ? WHERE userid = ?';
                    else if (coin === 'usdc') updateQuery = 'UPDATE users SET usdc = usdc + ? WHERE userid = ?';
                    else if (coin === 'pyusd') updateQuery = 'UPDATE users SET pyusd = pyusd + ? WHERE userid = ?';
                    else if (coin === 'sol') updateQuery = 'UPDATE users SET sol = sol + ? WHERE userid = ?';
                    
                    console.log('[Admin/approveDeposit] Update query:', updateQuery);
                    await runAsync(updateQuery, [amount, userId]);
                    console.log('[Admin/approveDeposit] User balance updated');

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 1, data: 'Deposit approved and balance updated' }));
                } catch (e) {
                    console.error('[Admin/approveDeposit] Error:', e.message);
                    console.error('[Admin/approveDeposit] Stack:', e.stack);
                    if (!res.headersSent) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ code: 0, data: e.message }));
                    }
                }
            })().catch(err => {
                console.error('[Admin/approveDeposit] Unhandled error:', err);
                if (!res.headersSent) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 0, data: 'Internal server error' }));
                }
            });
        });
        return;
    }

    // Reject deposit with SQLite
    if (pathname === '/Admin/rejectDeposit' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                let data = null;
                try {
                    data = JSON.parse(body);
                } catch (je) {
                    const params = {};
                    body.split('&').forEach(pair => {
                        const [k, v] = pair.split('=');
                        if (k) params[decodeURIComponent(k)] = decodeURIComponent((v || '').replace(/\+/g, ' '));
                    });
                    data = params;
                }

                const depositId = parseInt(data.depositId || data.depositid || data.id || data.deposit_id);
                
                // Check if deposit exists
                const deposit = await getAsync('SELECT * FROM topup_records WHERE id = ?', [depositId]);
                if (!deposit) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 0, data: 'Deposit not found' }));
                    return;
                }

                // Update deposit status to 'reject'
                await runAsync('UPDATE topup_records SET status = ? WHERE id = ?', ['reject', depositId]);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 1, data: 'Deposit rejected' }));
            } catch (e) {
                console.error('[Admin/rejectDeposit] Error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 0, data: e.message }));
            }
        });
        return;
    }

    // Get pending withdrawals
    if (pathname === '/Admin/getPendingWithdrawals' && req.method === 'GET') {
        try {
            const withdrawals = fs.existsSync('./withdrawals_records.json') ? JSON.parse(fs.readFileSync('./withdrawals_records.json', 'utf8')) : [];
            const pending = withdrawals.filter(w => w.status === 'pending' || w.status === 'processing');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: pending }));
        } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: [] }));
        }
        return;
    }

    // Get all withdrawals
    if (pathname === '/Admin/getAllWithdrawals' && req.method === 'GET') {
        try {
            const withdrawals = fs.existsSync('./withdrawals_records.json') ? JSON.parse(fs.readFileSync('./withdrawals_records.json', 'utf8')) : [];
            const sorted = withdrawals.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: sorted }));
        } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: [] }));
        }
        return;
    }

    // Approve withdrawal with MySQL
    if (pathname === '/Admin/approveWithdrawal' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            (async () => {
                try {
                    let data = null;
                    try {
                        data = JSON.parse(body);
                    } catch (je) {
                        const params = {};
                        body.split('&').forEach(pair => {
                            const [k, v] = pair.split('=');
                            if (k) params[decodeURIComponent(k)] = decodeURIComponent((v || '').replace(/\+/g, ' '));
                        });
                        data = params;
                    }
                    
                    const withdrawalId = parseInt(data.withdrawalId || data.withdrawalid || data.id || data.withdrawal_id);
                    
                    // Get withdrawal record
                    const withdrawal = await getAsync('SELECT * FROM withdrawals_records WHERE id = ?', [withdrawalId]);
                    if (!withdrawal) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ code: 0, data: 'Withdrawal not found' }));
                        return;
                    }

                    const userId = withdrawal.user_id;
                    const coin = withdrawal.coin.toLowerCase();
                    const amount = parseFloat(withdrawal.amount) || 0;

                    // Validate coin name
                    const validCoins = ['usdt', 'btc', 'eth', 'usdc', 'pyusd', 'sol'];
                    if (!validCoins.includes(coin)) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ code: 0, data: 'Invalid coin type' }));
                        return;
                    }

                    // Update withdrawal status to 'complete'
                    await runAsync('UPDATE withdrawals_records SET status = ? WHERE id = ?', ['complete', withdrawalId]);

                    // Update user balance - deduct withdrawal amount (prevent negative)
                    let updateQuery;
                    if (coin === 'usdt') updateQuery = 'UPDATE users SET usdt = GREATEST(0, usdt - ?) WHERE userid = ?';
                    else if (coin === 'btc') updateQuery = 'UPDATE users SET btc = GREATEST(0, btc - ?) WHERE userid = ?';
                    else if (coin === 'eth') updateQuery = 'UPDATE users SET eth = GREATEST(0, eth - ?) WHERE userid = ?';
                    else if (coin === 'usdc') updateQuery = 'UPDATE users SET usdc = GREATEST(0, usdc - ?) WHERE userid = ?';
                    else if (coin === 'pyusd') updateQuery = 'UPDATE users SET pyusd = GREATEST(0, pyusd - ?) WHERE userid = ?';
                    else if (coin === 'sol') updateQuery = 'UPDATE users SET sol = GREATEST(0, sol - ?) WHERE userid = ?';
                    
                    await runAsync(updateQuery, [amount, userId]);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 1, data: 'Withdrawal approved and balance updated' }));
                } catch (e) {
                    console.error('[Admin/approveWithdrawal] Error:', e.message);
                    if (!res.headersSent) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ code: 0, data: e.message }));
                    }
                }
            })().catch(err => {
                console.error('[Admin/approveWithdrawal] Unhandled error:', err);
                if (!res.headersSent) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 0, data: 'Internal server error' }));
                }
            });
        });
        return;
    }

    // Reject withdrawal with SQLite
    if (pathname === '/Admin/rejectWithdrawal' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                let data = null;
                try {
                    data = JSON.parse(body);
                } catch (je) {
                    const params = {};
                    body.split('&').forEach(pair => {
                        const [k, v] = pair.split('=');
                        if (k) params[decodeURIComponent(k)] = decodeURIComponent((v || '').replace(/\+/g, ' '));
                    });
                    data = params;
                }
                
                const withdrawalId = parseInt(data.withdrawalId || data.withdrawalid || data.id || data.withdrawal_id);
                
                // Check if withdrawal exists
                const withdrawal = await getAsync('SELECT * FROM withdrawals_records WHERE id = ?', [withdrawalId]);
                if (!withdrawal) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 0, data: 'Withdrawal not found' }));
                    return;
                }

                // Update withdrawal status to 'reject'
                await runAsync('UPDATE withdrawals_records SET status = ? WHERE id = ?', ['reject', withdrawalId]);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 1, data: 'Withdrawal rejected' }));
            } catch (e) {
                console.error('[Admin/rejectWithdrawal] Error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 0, data: e.message }));
            }
        });
        return;
    }

    // Get exchanges
    if (pathname === '/Admin/getExchanges' && req.method === 'GET') {
        try {
            const exchanges = fs.existsSync('./exchange_records.json') ? JSON.parse(fs.readFileSync('./exchange_records.json', 'utf8')) : [];
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: exchanges.slice(-50) }));
        } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: [] }));
        }
        return;
    }

    // Get all transactions
    if (pathname === '/Admin/getAllTransactions' && req.method === 'GET') {
        try {
            const deposits = fs.existsSync('./topup_records.json') ? JSON.parse(fs.readFileSync('./topup_records.json', 'utf8')) : [];
            const withdrawals = fs.existsSync('./withdrawals_records.json') ? JSON.parse(fs.readFileSync('./withdrawals_records.json', 'utf8')) : [];
            const exchanges = fs.existsSync('./exchange_records.json') ? JSON.parse(fs.readFileSync('./exchange_records.json', 'utf8')) : [];
            
            const allTxns = [
                ...deposits.map(d => ({ ...d, type: 'deposit', created_at: d.created_at || new Date() })),
                ...withdrawals.map(w => ({ ...w, type: 'withdrawal', created_at: w.created_at || new Date() })),
                ...exchanges.map(e => ({ ...e, type: 'exchange', created_at: e.created_at || new Date() }))
            ];
            
            const sorted = allTxns.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: sorted.slice(0, 100) }));
        } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: 1, data: [] }));
        }
        return;
    }

    // Search transactions
    if (pathname === '/Admin/searchTransactions' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const userid = data.userid || '';
                const type = data.type || '';

                const deposits = fs.existsSync('./topup_records.json') ? JSON.parse(fs.readFileSync('./topup_records.json', 'utf8')) : [];
                const withdrawals = fs.existsSync('./withdrawals_records.json') ? JSON.parse(fs.readFileSync('./withdrawals_records.json', 'utf8')) : [];
                const exchanges = fs.existsSync('./exchange_records.json') ? JSON.parse(fs.readFileSync('./exchange_records.json', 'utf8')) : [];
                
                let allTxns = [
                    ...deposits.map(d => ({ ...d, type: 'deposit' })),
                    ...withdrawals.map(w => ({ ...w, type: 'withdrawal' })),
                    ...exchanges.map(e => ({ ...e, type: 'exchange' }))
                ];

                if (userid) allTxns = allTxns.filter(t => t.userid === userid);
                if (type) allTxns = allTxns.filter(t => t.type === type);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 1, data: allTxns }));
            } catch (e) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 1, data: [] }));
            }
        });
        return;
    }

    // Get transaction detail
    if (pathname === '/Admin/getTransactionDetail' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const txnId = data.transactionId;

                const deposits = fs.existsSync('./topup_records.json') ? JSON.parse(fs.readFileSync('./topup_records.json', 'utf8')) : [];
                const withdrawals = fs.existsSync('./withdrawals_records.json') ? JSON.parse(fs.readFileSync('./withdrawals_records.json', 'utf8')) : [];
                const exchanges = fs.existsSync('./exchange_records.json') ? JSON.parse(fs.readFileSync('./exchange_records.json', 'utf8')) : [];

                let txn = deposits.find(d => d.id === txnId);
                if (!txn) txn = withdrawals.find(w => w.id === txnId);
                if (!txn) txn = exchanges.find(e => e.id === txnId);

                if (txn) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 1, data: txn }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 0, data: 'Transaction not found' }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 0, data: e.message }));
            }
        });
        return;
    }

    // Approve transaction
    if (pathname === '/Admin/approveTransaction' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const txnId = data.transactionId;

                let deposits = fs.existsSync('./topup_records.json') ? JSON.parse(fs.readFileSync('./topup_records.json', 'utf8')) : [];
                let withdrawals = fs.existsSync('./withdrawals_records.json') ? JSON.parse(fs.readFileSync('./withdrawals_records.json', 'utf8')) : [];
                let exchanges = fs.existsSync('./exchange_records.json') ? JSON.parse(fs.readFileSync('./exchange_records.json', 'utf8')) : [];

                let found = false;
                deposits = deposits.map(d => { if (d.id === txnId) { d.status = 'approved'; found = true; } return d; });
                if (!found) withdrawals = withdrawals.map(w => { if (w.id === txnId) { w.status = 'approved'; found = true; } return w; });
                if (!found) exchanges = exchanges.map(e => { if (e.id === txnId) { e.status = 'approved'; found = true; } return e; });

                if (found) {
                    if (deposits.some(d => d.id === txnId)) fs.writeFileSync('./topup_records.json', JSON.stringify(deposits, null, 2));
                    if (withdrawals.some(w => w.id === txnId)) fs.writeFileSync('./withdrawals_records.json', JSON.stringify(withdrawals, null, 2));
                    if (exchanges.some(e => e.id === txnId)) fs.writeFileSync('./exchange_records.json', JSON.stringify(exchanges, null, 2));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 1, data: 'Transaction approved' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 0, data: 'Transaction not found' }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 0, data: e.message }));
            }
        });
        return;
    }

    // Reject transaction
    if (pathname === '/Admin/rejectTransaction' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const txnId = data.transactionId;

                let deposits = fs.existsSync('./topup_records.json') ? JSON.parse(fs.readFileSync('./topup_records.json', 'utf8')) : [];
                let withdrawals = fs.existsSync('./withdrawals_records.json') ? JSON.parse(fs.readFileSync('./withdrawals_records.json', 'utf8')) : [];
                let exchanges = fs.existsSync('./exchange_records.json') ? JSON.parse(fs.readFileSync('./exchange_records.json', 'utf8')) : [];

                let found = false;
                deposits = deposits.map(d => { if (d.id === txnId) { d.status = 'rejected'; found = true; } return d; });
                if (!found) withdrawals = withdrawals.map(w => { if (w.id === txnId) { w.status = 'rejected'; found = true; } return w; });
                if (!found) exchanges = exchanges.map(e => { if (e.id === txnId) { e.status = 'rejected'; found = true; } return e; });

                if (found) {
                    if (deposits.some(d => d.id === txnId)) fs.writeFileSync('./topup_records.json', JSON.stringify(deposits, null, 2));
                    if (withdrawals.some(w => w.id === txnId)) fs.writeFileSync('./withdrawals_records.json', JSON.stringify(withdrawals, null, 2));
                    if (exchanges.some(e => e.id === txnId)) fs.writeFileSync('./exchange_records.json', JSON.stringify(exchanges, null, 2));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 1, data: 'Transaction rejected' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 0, data: 'Transaction not found' }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 0, data: e.message }));
            }
        });
        return;
    }

    // ARBITRAGE API ENDPOINTS

    // Get all arbitrage products
    if (pathname === '/api/arbitrage/products' && req.method === 'GET') {
        const products = getAllArbitrageProducts();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, products }));
        return;
    }

    // Get arbitrage product by ID
    if (pathname.match(/^\/api\/arbitrage\/product\/[\w-]+$/)) {
        const productId = pathname.split('/').pop();
        const product = getArbitrageProductById(productId);

        if (!product) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Product not found' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, product }));
        return;
    }

    // Create arbitrage subscription
    if (pathname === '/api/arbitrage/subscribe' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                let jsonBody = body;
                if (body.includes('}&')) {
                    jsonBody = body.substring(0, body.indexOf('}&') + 1);
                }

                const data = JSON.parse(jsonBody);
                const { user_id, product_id, amount } = data;

                if (!user_id || !product_id || !amount) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }

                const subscription = createArbitrageSubscription(user_id, product_id, amount);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, subscription }));
            } catch (e) {
                console.error('[arbitrage-subscribe] Error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // Get user arbitrage subscriptions
    if (pathname.match(/^\/api\/arbitrage\/subscriptions\?user_id=/)) {
        const queryParams = url.parse(pathname, true).query;
        const userId = queryParams.user_id;

        if (!userId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing user_id parameter' }));
            return;
        }

        const subscriptions = getUserArbitrageSubscriptions(userId);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, subscriptions }));
        return;
    }

    // Get user arbitrage statistics
    if (pathname.match(/^\/api\/arbitrage\/stats\?user_id=/)) {
        const queryParams = url.parse(pathname, true).query;
        const userId = queryParams.user_id;

        if (!userId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing user_id parameter' }));
            return;
        }

        const stats = getUserArbitrageStats(userId);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, stats }));
        return;
    }

    // Wallet API endpoints - connect / verify / me
    if (pathname === '/api/wallet/connect' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                const address = data.address;
                const chainId = data.chainId || 'ethereum';

                if (!address) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Missing wallet address' }));
                    return;
                }

                const result = connectWallet(address, chainId);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (e) {
                console.error('[wallet-connect] Error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: e.message }));
            }
        });
        return;
    }

    if (pathname.match(/^\/api\/wallet\/verify/) && req.method === 'GET') {
        const queryParams = url.parse(req.url, true).query;
        const address = queryParams.address;
        if (!address) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Missing address parameter' }));
            return;
        }

        const result = verifyWallet(address);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
        return;
    }

    if (pathname.match(/^\/api\/wallet\/me/) && req.method === 'GET') {
        const queryParams = url.parse(req.url, true).query;
        const uid = queryParams.uid;
        if (!uid) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Missing uid parameter' }));
            return;
        }

        const user = getUserByUID(uid);
        const wallet = getWalletByUID(uid);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user, wallet }));
        return;
    }

    // Handle image upload for top-up proof
    if (pathname === '/api/upload-image' && req.method === 'POST') {
        let chunks = [];
        
        req.on('data', chunk => {
            chunks.push(chunk);
        });
        
        req.on('end', () => {
            try {
                const buffer = Buffer.concat(chunks);
                // Generate a simple filename based on timestamp and random
                const filename = 'proof_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '.png';
                const uploadPath = path.join(__dirname, 'uploads', filename);
                
                // Create uploads directory if it doesn't exist
                const uploadsDir = path.join(__dirname, 'uploads');
                if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true });
                }
                
                // Save file to disk
                fs.writeFileSync(uploadPath, buffer);
                
                // Return just the filename/path
                const fileUrl = '/uploads/' + filename;
                
                console.error('[upload] Saved file:', filename, 'Size:', buffer.length, 'bytes');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    code: 1, 
                    data: fileUrl,
                    message: 'Image uploaded successfully'
                }));
            } catch (e) {
                console.error('[upload] Error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 0, data: e.message }));
            }
        });
        return;
    }

    // Handle uploads directory - serve uploaded files
    if (pathname.startsWith('/uploads/')) {
        const filename = path.basename(pathname);
        const uploadPath = path.join(__dirname, 'uploads', filename);
        
        // Security: ensure the file is in the uploads directory
        if (!uploadPath.startsWith(path.join(__dirname, 'uploads'))) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Forbidden');
            return;
        }
        
        if (fs.existsSync(uploadPath)) {
            const data = fs.readFileSync(uploadPath);
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(data);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
        }
        return;
    }

    // Handle Cloudflare RUM (Real User Monitoring) - suppress these requests locally
    if (pathname && pathname.startsWith('/cdn-cgi/')) {
        if (req.method === 'POST') {
            // Silently accept analytics data
            res.writeHead(204);
            res.end();
            return;
        }
    }

    // Default to index.html for root
    if (pathname === '/') {
        pathname = '/index.html';
    }

    // Handle requests for /js/ files - redirect to /Bvox_files/
    if (pathname.startsWith('/js/')) {
        const filename = pathname.split('/').pop();
        const alternatives = [
            path.join(__dirname, 'Bvox_files', filename + '.download'),
            path.join(__dirname, 'Bvox_files', filename),
            path.join(__dirname, 'js', filename),
            path.join(__dirname, filename)
        ];

        // Try to find the file from alternatives
        for (const alt of alternatives) {
            if (fs.existsSync(alt)) {
                pathname = alt.replace(__dirname, '');
                break;
            }
        }
    }

    // WALLET BALANCE ENDPOINT - Get user balances from MySQL
    if (pathname === '/Wallet/getbalance' && req.method === 'POST') {
        console.log('[Wallet/getbalance] Handler triggered for:', req.method, pathname);
        let body = '';
        let handlerExecuted = false;
        
        req.on('data', chunk => { 
            body += chunk;
        });
        
        req.on('end', () => {
            if (handlerExecuted) {
                console.log('[Wallet/getbalance] Handler already executed, ignoring');
                return;
            }
            handlerExecuted = true;
            console.log('[Wallet/getbalance] Body received, length:', body.length);
            
            (async () => {
                try {
                    let data = {};
                    
                    // Try to parse as JSON first
                    if (body.trim().startsWith('{')) {
                        try {
                            data = JSON.parse(body);
                            console.log('[Wallet/getbalance] Successfully parsed as JSON');
                        } catch (jsonErr) {
                            console.log('[Wallet/getbalance] JSON parse failed:', jsonErr.message);
                            throw jsonErr;
                        }
                    } else {
                        // Form-urlencoded
                        console.log('[Wallet/getbalance] Trying form-urlencoded');
                        const params = {};
                        body.split('&').forEach(pair => {
                            const [k, v] = pair.split('=');
                            if (k) params[decodeURIComponent(k)] = decodeURIComponent((v || '').replace(/\+/g, ' '));
                        });
                        data = params;
                    }

                    console.log('[Wallet/getbalance] Parsed data userid:', data.userid);
                    const userid = data.userid;

                    if (!userid) {
                        console.log('[Wallet/getbalance] Missing userid');
                        if (!res.headersSent) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ code: 0, error: 'Missing userid' }));
                        }
                        return;
                    }

                    console.log('[Wallet/getbalance] Querying database for userid:', userid);
                    // Get user data from MySQL
                    const user = await getAsync('SELECT * FROM users WHERE userid = ?', [userid]);
                    console.log('[Wallet/getbalance] Query returned:', !!user);
                    
                    if (!user) {
                        console.log('[Wallet/getbalance] User not found');
                        if (!res.headersSent) {
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ code: 0, error: 'User not found' }));
                        }
                        return;
                    }

                    const balances = {
                        usdt: parseFloat(user.usdt) || 0,
                        btc: parseFloat(user.btc) || 0,
                        eth: parseFloat(user.eth) || 0,
                        usdc: parseFloat(user.usdc) || 0,
                        pyusd: parseFloat(user.pyusd) || 0,
                        sol: parseFloat(user.sol) || 0
                    };

                    console.log('[Wallet/getbalance] Sending success response');
                    if (!res.headersSent) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ code: 1, data: balances }));
                    }
                    console.log('[Wallet/getbalance] Response sent successfully');
                } catch (e) {
                    console.error('[Wallet/getbalance] Error in async handler:', e.message);
                    if (!res.headersSent) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ code: 0, error: e.message }));
                    }
                }
            })().catch(err => {
                console.error('[Wallet/getbalance] Unhandled promise rejection:', err.message);
                if (!res.headersSent) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ code: 0, error: 'Internal server error' }));
                }
            });
        });
        return;
    }

    // Build file path
    let filePath = path.join(__dirname, pathname);

    // Resolve potential directory traversal attacks
    filePath = path.normalize(filePath);
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden: Path traversal detected');
        return;
    }

    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Attempt alternate lookups before returning 404:
                // 1) If request is /img/..., look for that file inside any "*_files" directory
                // 2) If request is top-level like /kline.html, try to find that file inside any "*_files" directory
                try {
                    const tryFindInFilesDirs = () => {
                        const baseName = path.basename(pathname);
                        const relImgPath = pathname.replace(/^\/img\//, '');
                        const entries = fs.readdirSync(__dirname, { withFileTypes: true });
                        for (const e of entries) {
                            if (e.isDirectory() && e.name.endsWith('_files')) {
                                // 1) If the request was /img/..., try the relative path inside this _files dir
                                const candidate1 = path.join(__dirname, e.name, relImgPath);
                                if (fs.existsSync(candidate1)) return candidate1;

                                // 2) Try the basename inside the _files dir (e.g., /kline.html -> contract_files/kline.html)
                                const candidate2 = path.join(__dirname, e.name, baseName);
                                if (fs.existsSync(candidate2)) return candidate2;
                            }
                        }
                        // Also try a central 'img' folder if it exists
                        const centralImg = path.join(__dirname, 'img', pathname.replace(/^\/img\//, ''));
                        if (fs.existsSync(centralImg)) return centralImg;
                        return null;
                    };

                    const alt = tryFindInFilesDirs();
                    if (alt) {
                        const ext = path.extname(alt).toLowerCase();
                        const contentType = mimeTypes[ext] || 'application/octet-stream';
                        const data = fs.readFileSync(alt);
                        if (ext !== '.html') {
                            res.setHeader('Cache-Control', 'public, max-age=3600');
                        } else {
                            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                        }
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(data);
                        return;
                    }
                } catch (e) {
                    // fall through to 404 render
                }

                // File not found (after alternate lookups)
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>404 - File Not Found</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 50px; }
                            h1 { color: #d32f2f; }
                            p { font-size: 16px; }
                        </style>
                    </head>
                    <body>
                        <h1>404 - File Not Found</h1>
                        <p>The requested file: <code>${pathname}</code> could not be found.</p>
                        <p>Search attempted in per-page <code>*_files</code> folders.</p>
                        <p><a href="/">Go back to home</a></p>
                    </body>
                    </html>
                `);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${err.code}`);
            }
            return;
        }

        // Handle directories
        if (stats.isDirectory()) {
            // Try to serve index.html from the directory
            filePath = path.join(filePath, 'index.html');
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 - Not Found');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
            return;
        }

        // Get file extension
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // Read and serve the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }

            // Add caching headers for static assets
            if (ext !== '.html') {
                res.setHeader('Cache-Control', 'public, max-age=3600');
            } else {
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });


} catch (err) {
    console.error('Unhandled error in request:', err);
    if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error', message: err.message }));
    }
}
});

server.listen(PORT, HOST, () => {
    console.log(`\n╔════════════════════════════════════════════╗`);
    console.log(`║     BVOX Finance Development Server        ║`);
    console.log(`╚════════════════════════════════════════════╝\n`);
    console.log(`🚀 Server running at: http://${HOST}:${PORT}`);
    console.log(`📁 Root directory: ${__dirname}`);
    console.log(`🗄️  Database: MySQL (cryptonest)\n`);
    console.log(`Available features:`);
    console.log(`  ✓ Static file serving`);
    console.log(`  ✓ CORS enabled`);
    console.log(`  ✓ MySQL database`);
    console.log(`  ✓ Development debugging\n`);
    console.log(`Open your browser at: http://${HOST}:${PORT}\n`);
    console.log(`Press Ctrl+C to stop the server`);
    console.log(`    `);
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`✗ Port ${PORT} is already in use.`);
        console.log(`Try: node server.js --port ${PORT + 1}`);
    } else {
        console.error(`✗ Server error: ${err.message}`);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n⚠ SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('✓ HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n⚠ SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('✓ HTTP server closed');
        process.exit(0);
    });
});
