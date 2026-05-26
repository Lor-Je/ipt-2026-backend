const mysql = require('mysql2/promise');

async function test() {
    try {
        const connection = await mysql.createConnection({
            host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
            port: 4000,
            user: '4UoxZzZ5xRBY87K.root',
            password: 'ik35BNRYrVuKufGc',
            database: 'test',
            ssl: { rejectUnauthorized: false }
        });
        console.log("Connected to test!");
        await connection.query('CREATE TABLE IF NOT EXISTS accounts (id INT);');
        console.log("Table created!");
        await connection.end();
    } catch(err) {
        console.error("Failed:", err);
    }
}
test();
