const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
};

async function setupDatabase() {
    let conn = null;
    try {
        // Connect to MySQL
        conn = await mysql.createConnection(config);
        console.log('✓ Connected to MySQL');

        // Create database
        await conn.query('CREATE DATABASE IF NOT EXISTS cryptonest');
        console.log('✓ Database created/exists');

        // Select database
        await conn.query('USE cryptonest');
        
        // Create users table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS users (
                userid VARCHAR(50) PRIMARY KEY,
                username VARCHAR(100),
                email VARCHAR(100),
                password VARCHAR(255),
                usdt DECIMAL(20, 2) DEFAULT 0,
                btc DECIMAL(20, 8) DEFAULT 0,
                eth DECIMAL(20, 8) DEFAULT 0,
                usdc DECIMAL(20, 2) DEFAULT 0,
                pyusd DECIMAL(20, 2) DEFAULT 0,
                sol DECIMAL(20, 8) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Users table created/exists');

        // Create topup_records table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS topup_records (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(50) NOT NULL,
                coin VARCHAR(50),
                amount DECIMAL(20, 8),
                status VARCHAR(50) DEFAULT 'pending',
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(userid)
            )
        `);
        console.log('✓ Topup records table created/exists');

        // Create withdrawals_records table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS withdrawals_records (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(50) NOT NULL,
                coin VARCHAR(50),
                amount DECIMAL(20, 8),
                status VARCHAR(50) DEFAULT 'pending',
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(userid)
            )
        `);
        console.log('✓ Withdrawals records table created/exists');

        // Import users data
        const usersPath = path.join(__dirname, 'users.json');
        if (fs.existsSync(usersPath)) {
            const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
            
            for (const user of usersData) {
                const userid = user.userid || user.user_id || user.userId;
                try {
                    await conn.query(
                        `INSERT IGNORE INTO users (userid, username, email, password, usdt, btc, eth, usdc, pyusd, sol)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            userid,
                            user.username || '',
                            user.email || '',
                            user.password || '',
                            user.usdt || 0,
                            user.btc || 0,
                            user.eth || 0,
                            user.usdc || 0,
                            user.pyusd || 0,
                            user.sol || 0
                        ]
                    );
                } catch (err) {
                    console.error('Insert error for user:', userid, err.message);
                }
            }
            console.log(`✓ Imported ${usersData.length} users`);
        }

        // Import topup records
        const topupPath = path.join(__dirname, 'topup_records.json');
        if (fs.existsSync(topupPath)) {
            const topupData = JSON.parse(fs.readFileSync(topupPath, 'utf8'));
            
            for (const record of topupData) {
                const userId = record.user_id || record.userid || record.userId;
                try {
                    await conn.query(
                        `INSERT INTO topup_records (user_id, coin, amount, status, date)
                         VALUES (?, ?, ?, ?, ?)`,
                        [
                            userId,
                            record.coin || '',
                            record.amount || 0,
                            record.status || 'pending',
                            record.date || new Date()
                        ]
                    );
                } catch (err) {
                    console.error('Insert error for topup:', err.message);
                }
            }
            console.log(`✓ Imported ${topupData.length} topup records`);
        }

        // Import withdrawal records
        const withdrawalPath = path.join(__dirname, 'withdrawals_records.json');
        if (fs.existsSync(withdrawalPath)) {
            const withdrawalData = JSON.parse(fs.readFileSync(withdrawalPath, 'utf8'));
            
            for (const record of withdrawalData) {
                const userId = record.user_id || record.userid || record.userId;
                try {
                    await conn.query(
                        `INSERT INTO withdrawals_records (user_id, coin, amount, status, date)
                         VALUES (?, ?, ?, ?, ?)`,
                        [
                            userId,
                            record.coin || '',
                            record.amount || 0,
                            record.status || 'pending',
                            record.date || new Date()
                        ]
                    );
                } catch (err) {
                    console.error('Insert error for withdrawal:', err.message);
                }
            }
            console.log(`✓ Imported ${withdrawalData.length} withdrawal records`);
        }

        await conn.end();
        console.log('\n✓✓✓ MySQL setup complete! ✓✓✓\n');

    } catch (error) {
        console.error('Error during setup:', error.message);
        if (conn) await conn.end();
        process.exit(1);
    }
}

setupDatabase();
