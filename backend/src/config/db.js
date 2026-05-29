const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Iitian123$#',
  database: 'order_management',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;