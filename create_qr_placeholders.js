/**
 * Create QR code placeholder images in _files directories
 */
const fs = require('fs');
const path = require('path');

// Simple PNG placeholder (same 1x1 transparent pixel)
const transparentPNG = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
    0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
    0x42, 0x60, 0x82
]);

const baseDir = __dirname;
const coins = ['usdt', 'btc', 'eth', 'usdc', 'pyusd', 'sol'];

// Get all *_files directories
const entries = fs.readdirSync(baseDir, { withFileTypes: true });
const filesDirs = entries.filter(e => e.isDirectory() && e.name.endsWith('_files'));

console.log(`Found ${filesDirs.length} _files directories`);

// Create QR placeholders in each _files directory
filesDirs.forEach(dir => {
    coins.forEach(coin => {
        const qrFile = path.join(baseDir, dir.name, `${coin}_qr.png`);
        if (!fs.existsSync(qrFile)) {
            fs.writeFileSync(qrFile, transparentPNG);
            console.log(`Created: ${dir.name}/${coin}_qr.png`);
        }
    });
});

console.log('✓ QR code placeholders created successfully');
