const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'seqRoot',
  password: 'a1b2c3',
  database: 'sequelize_db',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();