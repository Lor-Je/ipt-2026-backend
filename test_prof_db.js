const mysql = require('mysql2/promise');

async function test() {
    try {
        const connection = await mysql.createConnection({
            host: '153.92.15.31',
            port: 3306,
            user: 'u875409848_2026_1',
            password: 's*3o^*xCA',
            database: 'u875409848_2026_1'
        });
        console.log("Connected to professor's DB!");
        const [rows] = await connection.query('SHOW TABLES;');
        console.log("Tables:", rows);
        await connection.end();
    } catch(err) {
        console.error("Failed:", err.message);
    }
}
test();
