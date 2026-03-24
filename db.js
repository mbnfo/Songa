const mysql = require("mysql2/promise");
const fs = require("fs"); // <-- you must import fs to use readFileSync
//require("dotenv").config();
const path = require("path");
// Always load .env from the project root
require("dotenv").config({ path: path.resolve(__dirname, ".env") });






const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  

  ssl: {
    // This enforces SSL and rejects invalid certificates
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(__dirname, "ca.pem")) },
});
console.log("Loaded from:", path.resolve(__dirname, "../.env"));
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "*****" : "MISSING");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "*****" : "MISSING");

module.exports = pool;