 require('dotenv').config();
let mysql = require('mysql2');

let connection = mysql.createConnection({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.log('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database');
});


connection.end();
