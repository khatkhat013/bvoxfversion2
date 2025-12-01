const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'cryptonest.db');

// Delete existing database
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✓ Old database removed');
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database open error:', err.message);
        process.exit(1);
    }
    console.log('✓ Connected to SQLite');
});

db.serialize(() => {
    // Create users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            userid TEXT PRIMARY KEY,
            username TEXT,
            email TEXT,
            password TEXT,
            usdt REAL DEFAULT 0,
            btc REAL DEFAULT 0,
            eth REAL DEFAULT 0,
            usdc REAL DEFAULT 0,
            pyusd REAL DEFAULT 0,
            sol REAL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Users table error:', err);
        else console.log('✓ Users table created');
    });

    // Create topup_records table
    db.run(`
        CREATE TABLE IF NOT EXISTS topup_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            coin TEXT,
            amount REAL,
            status TEXT DEFAULT 'pending',
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(userid)
        )
    `, (err) => {
        if (err) console.error('Topup table error:', err);
        else console.log('✓ Topup records table created');
    });

    // Create withdrawals_records table
    db.run(`
        CREATE TABLE IF NOT EXISTS withdrawals_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            coin TEXT,
            amount REAL,
            status TEXT DEFAULT 'pending',
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(userid)
        )
    `, (err) => {
        if (err) console.error('Withdrawal table error:', err);
        else console.log('✓ Withdrawals records table created');
    });

    // Import users data
    const usersPath = path.join(__dirname, 'users.json');
    if (fs.existsSync(usersPath)) {
        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        const stmt = db.prepare(`
            INSERT INTO users (userid, username, email, password, usdt, btc, eth, usdc, pyusd, sol)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        let count = 0;
        for (const user of usersData) {
            const userid = user.userid || user.user_id || user.userId;
            stmt.run(
                userid,
                user.username || '',
                user.email || '',
                user.password || '',
                user.usdt || 0,
                user.btc || 0,
                user.eth || 0,
                user.usdc || 0,
                user.pyusd || 0,
                user.sol || 0,
                (err) => {
                    if (err) console.error('Insert error:', err);
                }
            );
            count++;
        }
        stmt.finalize();
        console.log(`✓ Imported ${count} users`);
    }

    // Import topup records
    const topupPath = path.join(__dirname, 'topup_records.json');
    if (fs.existsSync(topupPath)) {
        const topupData = JSON.parse(fs.readFileSync(topupPath, 'utf8'));
        const stmt = db.prepare(`
            INSERT INTO topup_records (user_id, coin, amount, status, date)
            VALUES (?, ?, ?, ?, ?)
        `);
        
        let count = 0;
        for (const record of topupData) {
            const userId = record.user_id || record.userid || record.userId;
            stmt.run(
                userId,
                record.coin || '',
                record.amount || 0,
                record.status || 'pending',
                record.date || new Date().toISOString(),
                (err) => {
                    if (err) console.error('Insert error:', err);
                }
            );
            count++;
        }
        stmt.finalize();
        console.log(`✓ Imported ${count} topup records`);
    }

    // Import withdrawal records
    const withdrawalPath = path.join(__dirname, 'withdrawals_records.json');
    if (fs.existsSync(withdrawalPath)) {
        const withdrawalData = JSON.parse(fs.readFileSync(withdrawalPath, 'utf8'));
        const stmt = db.prepare(`
            INSERT INTO withdrawals_records (user_id, coin, amount, status, date)
            VALUES (?, ?, ?, ?, ?)
        `);
        
        let count = 0;
        for (const record of withdrawalData) {
            const userId = record.user_id || record.userid || record.userId;
            stmt.run(
                userId,
                record.coin || '',
                record.amount || 0,
                record.status || 'pending',
                record.date || new Date().toISOString(),
                (err) => {
                    if (err) console.error('Insert error:', err);
                }
            );
            count++;
        }
        stmt.finalize();
        console.log(`✓ Imported ${count} withdrawal records`);
    }

    setTimeout(() => {
        db.close(() => {
            console.log('\n✓✓✓ SQLite setup complete! Database: cryptonest.db ✓✓✓\n');
        });
    }, 500);
});

db.on('error', (err) => {
    console.error('Database error:', err.message);
});
