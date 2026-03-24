// utils/logAction.js
const db = require("../../db"); // import your MySQL pool

/**
 * Records an audit log entry in the database.
 * @param {string} user - Username of the actor
 * @param {string} role - Role of the actor (admin, finance, driver, support)
 * @param {string} action - Short action name (e.g. "Driver Updated")
 * @param {string} details - Longer description (e.g. "Driver 12 updated by admin")
 */
async function logAction(user, role, action, details) {
  try {
    await db.query(
      "INSERT INTO audit_logs (user, role, action, details, timestamp) VALUES (?, ?, ?, ?, NOW())",
      [user, role, action, details]
    );
  } catch (err) {
    console.error("Failed to log action:", err);
  }
}

module.exports = logAction;