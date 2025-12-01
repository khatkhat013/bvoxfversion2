// Simple API test
const http = require('http');

const data = JSON.stringify({
    user_id: "test-user-123",
    coin: "USDT",
    address: "0xd8dD63e1A50A54e43F13C5E559660872083Db59B",
    photo_url: "test-photo.jpg",
    amount: 100
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/topup-record',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS:`, res.headers);
    
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log(`BODY:`, body);
        try {
            console.log(`PARSED:`, JSON.parse(body));
        } catch(e) {
            console.log(`(Could not parse as JSON)`);
        }
    });
});

req.on('error', (e) => {
    console.error(`ERROR:`, e.message);
});

console.log('Sending test request to /api/topup-record...');
req.write(data);
req.end();

setTimeout(() => process.exit(0), 2000);
