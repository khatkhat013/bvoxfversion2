const mysql = require('mysql2/promise');

// Single connection for testing/development
let connection = null;

async function getConnection() {
    // If connection doesn't exist, create it
    if (!connection) {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'cryptonest'
        });
    }
    
    // Check if connection is still valid
    try {
        await connection.ping();
    } catch (err) {
        console.log('Connection lost, reconnecting...');
        connection = null;
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'cryptonest'
        });
    }
    
    return connection;
}

async function runAsync(query, params = []) {
    const conn = await getConnection();
    const result = await conn.query(query, params);
    // result[0] contains the ResultSetHeader for INSERT/UPDATE/DELETE
    const header = result[0];
    return { id: header.insertId, changes: header.affectedRows };
}

async function getAsync(query, params = []) {
    const conn = await getConnection();
    const result = await conn.query(query, params);
    // result[0] contains the rows array
    const rows = result[0] || [];
    return rows[0] || null;
}

async function allAsync(query, params = []) {
    const conn = await getConnection();
    const result = await conn.query(query, params);
    // result[0] contains the rows array
    const rows = result[0] || [];
    return rows;
}

// Test connection on startup
(async () => {
    try {
        const conn = await getConnection();
        console.log('✓ MySQL database connected (cryptonest)');
    } catch (err) {
        console.error('✗ MySQL connection failed:', err.message);
        process.exit(1);
    }
})();

module.exports = {
    runAsync,
    getAsync,
    allAsync
};
