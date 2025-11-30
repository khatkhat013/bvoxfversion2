/**
 * Script to add wallet authentication to all HTML pages
 * Run this to inject js/walletAuth.js into all HTML files
 */

const fs = require('fs');
const path = require('path');

// List of HTML files to update
const htmlFiles = [
    'mining.html',
    'contract.html',
    'ai-arbitrage.html',
    'loan.html',
    'assets.html',
    'identity.html',
    'financial.html',
    'exchange.html',
    'kyc1.html',
    'kyc2.html',
    'coin.html',
    'send-record.html',
    'contract-record.html',
    'exchange-record.html',
    'ai-plan.html',
    'ai-record.html',
    'topup.html',
    'topup-record.html',
    'loan-record.html',
    'notify.html',
    'out.html',
    'telegram.html',
    'service.html',
    'license.html',
    'faqs.html',
    'lang.html'
];

const scriptTag = '\n\t<script src="./js/walletAuth.js" type="text/javascript" charset="utf-8"></script>';

let updatedCount = 0;
let errorCount = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(`⏭️  Skipped: ${file} (file not found)`);
            return;
        }
        
        // Read file
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if already has walletAuth.js
        if (content.includes('walletAuth.js')) {
            console.log(`✓ Already updated: ${file}`);
            return;
        }
        
        // Check if has lang.js
        if (content.includes('lang.js')) {
            // Add after lang.js
            content = content.replace(
                /<script src="\.\/js\/lang\.js"/,
                `<script src="./js/lang.js"` + scriptTag + '\n\t\t<script src="./js/lang.js'
            );
            content = content.replace(
                `<script src="./js/lang.js"` + scriptTag + '\n\t\t<script src="./js/lang.js',
                `<script src="./js/lang.js"`
            );
            content = content.replace(
                /<script src="\.\/js\/lang\.js"[^>]*><\/script>/,
                `<script src="./js/lang.js" type="text/javascript" charset="utf-8"></script>` + scriptTag
            );
        } else {
            // Add before closing body tag
            content = content.replace(
                '</body>',
                scriptTag + '\n\t</body>'
            );
        }
        
        // Write file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${file}`);
        updatedCount++;
        
    } catch (error) {
        console.error(`❌ Error updating ${file}:`, error.message);
        errorCount++;
    }
});

console.log(`\n${'='.repeat(50)}`);
console.log(`✅ Successfully updated: ${updatedCount} files`);
console.log(`❌ Errors: ${errorCount} files`);
console.log(`${'='.repeat(50)}\n`);
console.log('🎉 Wallet authentication has been added to all pages!');
console.log('📝 All HTML files now show wallet connection prompt if user not authenticated.');
