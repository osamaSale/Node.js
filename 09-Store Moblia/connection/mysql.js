const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
}); 


connection.getConnection((err, connection) => {
    if (err) {
      console.error("CONNECTION ERROR: ", err.stack);
      return;
    }
    console.log("CONNECTION ID: ", connection.threadId);
  });
  
  module.exports = connection;