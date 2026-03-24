const mysql = require("mysql2/promise");
const fs = require("fs"); // <-- you must import fs to use readFileSync
//require("dotenv").config();
const path = require("path");
// Always load .env from the project root
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });







const pool = mysql.createPool({
  host: "mysql-2668dfd7-songa.j.aivencloud.com",
  user: "avnadmin",
  password:  process.env.DB_PASSWORD,
  database: "fleet_management",
  port: 15433,
  

  ssl: {
    // This enforces SSL and rejects invalid certificates
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(__dirname, "ca.pem")) },
});
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "*****" : "MISSING");

module.exports = pool;