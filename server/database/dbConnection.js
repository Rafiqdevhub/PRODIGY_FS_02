const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.BD_NAME,
});

dbConnection.connect(function (err) {
  if (err) {
    console.log("connection error", err);
  } else {
    console.log("Connected to the database");
  }
});

module.exports = dbConnection;
