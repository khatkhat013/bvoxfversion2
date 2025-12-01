const mysql = require('mysql2/promise');

async function test() {
    try {
        console.log('Connecting to MySQL...');
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'cryptonest'
        });
        console.log('✓ Connected');

        console.log('\nTesting SELECT query...');
        const result = await connection.query('SELECT * FROM users WHERE userid = ?', ['37282']);
        console.log('Query result received');
        console.log('Result[0] (rows):', result[0]);
        console.log('First user:', result[0][0]);

        await connection.end();
        console.log('\n✓ Test completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        console.error('Stack:', err.stack);
        process.exit(1);
    }
}

test();
