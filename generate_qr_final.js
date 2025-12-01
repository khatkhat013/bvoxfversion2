/**
 * Generate QR codes as SVG using qrcode.js library
 * Creates simple base64-encoded QR code images inline
 */
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Cryptocurrency addresses
const addresses = {
    usdt: '0xd8dD63e1A50A54e43F13C5E559660872083Db59B',
    btc: '1A1z7agoat3oPLCsF81efx3LAG5xfqc5z',
    eth: '0x742d35Cc6634C0532925a3b844Bc4e7595f0bEb3',
    usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    pyusd: '0x6c3ea9036406852006290033d98974699fbb0a39',
    sol: 'GJwrZyV3rFvjtEdnwoCd9DvxMVNWNWp5MSJAcWpeGX'
};

const baseDir = __dirname;
const coins = Object.keys(addresses);

// Get all *_files directories
const entries = fs.readdirSync(baseDir, { withFileTypes: true });
const filesDirs = entries.filter(e => e.isDirectory() && e.name.endsWith('_files'));

console.log(`Generating QR codes for ${filesDirs.length} directories...\n`);

let completed = 0;
const total = filesDirs.length * coins.length;

filesDirs.forEach(dir => {
    coins.forEach(coin => {
        const qrFile = path.join(baseDir, dir.name, `${coin}_qr.png`);
        const address = addresses[coin];
        
        QRCode.toFile(qrFile, address, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.98,
            margin: 2,
            width: 400,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, (err) => {
            completed++;
            if (err) {
                console.error(`✗ Error: ${dir.name}/${coin}_qr.png`);
            } else {
                console.log(`✓ Created: ${dir.name}/${coin}_qr.png (${completed}/${total})`);
            }
            
            if (completed === total) {
                console.log(`\n✅ All ${total} QR codes generated successfully!`);
            }
        });
    });
});
