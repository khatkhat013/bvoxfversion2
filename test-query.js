const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('Attempting connection...');
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'cryptonest'
        });
        console.log('✓ Connected');
        
        console.log('Testing .query() method...');
        const result = await connection.query('SELECT * FROM users WHERE userid = ?', ['37282']);
        console.log('✓ Query successful');
        console.log('Result structure:', Object.keys(result));
        console.log('Result[0]:', result[0]);
        console.log('Result[0][0]:', result[0][0]);
        
        console.log('\nTesting .query() for UPDATE...');
        const updateResult = await connection.query('UPDATE topup_records SET status = ? WHERE id = ?', ['complete', 1]);
        console.log('✓ Update query successful');
        console.log('Update result:', updateResult[0]);
        
        await connection.end();
        console.log('✓ Connection closed');
    } catch (err) {
        console.error('ERROR:', err.message);
        console.error('STACK:', err.stack);
    }
}

testConnection();
