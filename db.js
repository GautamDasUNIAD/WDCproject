// db.js
require('dotenv').config();
const mysql = require('mysql');

var dbConnectionPool = mysql.createPool({
    host: 'localhost',
    database: 'volunteer_db'
});

module.exports = dbConnectionPool;
