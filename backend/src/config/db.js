const mysql = require('mysql2/promise');
require('dotenv').config();

async function connectDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log('connection successfull');
    return connection;
  } catch (error) {
    console.error('connection failed:', error.message);
    process.exit(1); 
  }
}

module.exports = connectDB;
