// test-db.js
const pool = require("./db"); // uses your db.js with SSL + CA cert

(async () => {
  try {
    // Run a simple query to check connectivity
    const [rows] = await pool.query("SELECT NOW()");
    console.log("✅ Connected to Aiven MySQL!");
    console.log("Server time:", rows[0]);
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    process.exit();
  }
})();