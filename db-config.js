const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cryptonest.db');

// Create synchronous database instance
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    } else {
        console.log('✓ SQLite database connected');
    }
});

function runAsync(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                console.error('Database error:', err.message);
                reject(err);
            } else {
                resolve({ id: this.lastID, changes: this.changes });
            }
        });
    });
}

function getAsync(query, params = []) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                console.error('Database error:', err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

function allAsync(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                console.error('Database error:', err.message);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

module.exports = {
    runAsync,
    getAsync,
    allAsync
};
