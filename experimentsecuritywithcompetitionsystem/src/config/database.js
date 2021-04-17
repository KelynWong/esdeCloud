const mysql = require('mysql2');
//To find out more on createPool:
//https://www.npmjs.com/package/mysql#pooling-connections

module.exports = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    multipleStatements: true
});