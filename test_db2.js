require('ts-node').register();
process.env.NODE_ENV = 'production';
process.env.DB_HOST = 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com';
process.env.DB_PORT = '4000';
process.env.DB_USER = '4UoxZzZ5xRBY87K.root';
process.env.DB_PASSWORD = 'ik35BNRYrVuKufGc';
process.env.DB_NAME = 'test';
process.env.DB_SSL = 'true';
process.env.JWT_SECRET = 'my_super_secret_jwt_key_12345';

const db = require('./_helpers/db').default;

db.ready.then(() => {
    console.log("Sequelize Connected!");
}).catch(err => {
    console.error("Sequelize Failed:", err);
});
