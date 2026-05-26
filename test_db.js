const mysql = require('mysql2/promise');

async function test() {
    try {
        const connection = await mysql.createConnection({
            host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
            port: 4000,
            user: '4UoxZzZ5xRBY87K.root',
            password: 'ik35BNRYrVuKufGc',
            ssl: { rejectUnauthorized: false }
        });
        const [rows] = await connection.query('SHOW DATABASES;');
        console.log("Databases:", rows);
        await connection.end();
    } catch(err) {
        console.error("Failed:", err);
    }
}
test();
