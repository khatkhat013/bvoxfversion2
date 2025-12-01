const { getAsync, runAsync } = require('./db-config-mysql');

async function test() {
    try {
        console.log('Testing getAsync...');
        const user = await getAsync('SELECT * FROM users WHERE userid = ?', ['37282']);
        console.log('Got user:', user);
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
