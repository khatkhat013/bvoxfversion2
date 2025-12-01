/**
 * Simple Development Server for BVOX Finance
 * Serves static files and handles CORS
 * 
 * Usage: node server.js
 */

const http = require('http');
const { registerUser } = require('./userModel');
const { saveTopupRecord, getUserTopupRecords } = require('./topupRecordModel');
const { saveWithdrawalRecord, getUserWithdrawalRecords } = require('./withdrawalRecordModel');
const { saveExchangeRecord, getUserExchangeRecords } = require('./exchangeRecordModel');
const { getAllUsers, getUserById, updateUserBalance, getUserStats, addTopupRecord, addWithdrawalRecord, deleteTransaction } = require('./adminModel');
const { registerAdmin, loginAdmin, getAdminById, verifyToken } = require('./authModel');
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

// Start server
server.listen(PORT, HOST, () => {
    console.log(`
╔════════════════════════════════════════════╗
║     BVOX Finance Development Server        ║
╚════════════════════════════════════════════╝

🚀 Server running at: http://${HOST}:${PORT}
📁 Root directory: ${__dirname}

Available features:
  ✓ Static file serving
  ✓ CORS enabled
  ✓ Hot reload compatible
  ✓ Development debugging

Open your browser at: http://${HOST}:${PORT}

Press Ctrl+C to stop the server
    `);
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
