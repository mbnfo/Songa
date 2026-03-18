const pool = require("./db");

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("DB Connected:", rows);
  } catch (err) {
    console.error("DB Connection Failed:", err);
  }
}

testConnection();