const { getAsync } = require('./db-config-mysql');

async function testGetAsync() {
    try {
        console.log('Testing getAsync with userid 37282...');
        const user = await getAsync('SELECT * FROM users WHERE userid = ?', ['37282']);
        console.log('✓ Got user:', user);
        process.exit(0);
    } catch (err) {
        console.error('✗ Error:', err.message);
        console.error('Stack:', err.stack);
        process.exit(1);
    }
}

testGetAsync();
