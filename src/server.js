// server.js
// -----------------------------
// Express backend for Fleet Management
// Handles user creation and authentication
// -----------------------------

const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db"); // MySQL pool
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");
require("dotenv").config();



app.use((req, res, next) => {
  // ✅ This header tells ngrok to skip the browser warning page
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

// ✅ Middleware first
app.use(cors(({origin: 'http://localhost:3000/'}))); // Allow cross-origin requests

app.use(express.json()); // Parse JSON request bodies

// 🔑 Debug line to check JWT_SECRET
if (process.env.JWT_SECRET) {
  console.log("✅ JWT_SECRET loaded:", process.env.JWT_SECRET);
} else {
  console.log("❌ JWT_SECRET is missing!");
}




// -----------------------------
// User Registration Route
// -----------------------------
app.post("/register", async (req, res) => {
  const { username, password, role, driverId, firstName, lastName, cellNumber, email, id_passport, address } = req.body;
  if (!username || !password || !role || !firstName || !lastName || !cellNumber || !email ||!id_passport|| !address) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    // Hash the password before saving
    const password_hash = await bcrypt.hash(password, 10);

     // Insert user into database
    await db.query(
      "INSERT INTO users (username, password_hash, role, driver_id, first_name, last_name, cell_number, email,id_passport,address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [username, password_hash, role, role === "driver" ? driverId : null, firstName, lastName, cellNumber, email,id_passport,address]
    );
    res.json({ message: "✅User registered successfully!" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "❌Failed to register user." });
  }
});

// -----------------------------
// Login Route
// -----------------------------
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
     // Find user by username
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "❌Invalid username" });

    // Compare password with stored hash
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "❌Invalid password" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, driverId: user.driver_id },
      process.env.JWT_SECRET ,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("❌Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// Protected Dashboard Data Route
// -----------------------------
app.get("/dashboard-data", async (req, res) => {
  try {
    // Pull earnings joined with drivers for richer info
    const [rows] = await db.query(`
      SELECT 
        e.id,
        e.driver_id,
        d.name AS driver_name,
        e.week,
        e.gross,
        e.commission,
        e.net,
        e.payout_status
      FROM earnings e
      LEFT JOIN drivers d ON e.driver_id = d.id
      ORDER BY e.week ASC
    `);

    // Always return JSON
    res.json(rows);
  } catch (err) {
    console.error("Dashboard data fetch error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// -----------------------------
// Driver Statement PDF Route
// -----------------------------
const PDFDocument = require("pdfkit"); // ✅ PDF generation library
const crypto = require("crypto");      // ✅ For generating unique statement IDs
//const path = require("path");

app.get("/driver-statement/:driverId", async (req, res) => {
  const { driverId } = req.params;

  try {
    // ✅ Fetch driver info (name, vehicle, city) from drivers table
    const [driverRows] = await db.query(
      "SELECT name, vehicle_id, city FROM drivers WHERE id = ?",
      [driverId]
    );
    const driver = driverRows[0];

    // ✅ Fetch weekly earnings for this driver
    const [rows] = await db.query(
      "SELECT week, gross, commission, net, payout_status FROM earnings WHERE driver_id = ? ORDER BY week ASC",
      [driverId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "No earnings found for this driver" });
    }

    // ✅ Generate Statement ID (unique hash)
    const statementId = `SONGA-${driverId}-${crypto.randomBytes(4).toString("hex")}`;

    // ✅ Get date range (first and last week)
    const startWeek = rows[0].week;
    const endWeek = rows[rows.length - 1].week;

    // ✅ Set headers so browser downloads PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=statement_${driverId}.pdf`
    );

    // ✅ Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // ✅ Add company logo (make sure logo.png exists in your project folder)
    const logoPath = path.join(__dirname, "assets", "logo.png");
    try {
      doc.image(logoPath, 50, 40, { width: 80 }); // left corner
    } catch (err) {
      console.warn("Logo not found, skipping image.");
    }

    // ✅ Company header
    doc.fontSize(20).text("Songa Fleet Management", 150, 50); // next to logo
    doc.moveDown();
    doc.fontSize(14).text("Weekly Driver Earnings Statement", { align: "center" });
    doc.moveDown();

    // ✅ Statement metadata
    doc.fontSize(12).text(`Statement ID: ${statementId}`);
    doc.text(`Period: ${startWeek} to ${endWeek}`);
    doc.moveDown();

    // ✅ Driver info section
    doc.fontSize(12).text(`Driver Name: ${driver?.name || "N/A"}`);
    doc.text(`Driver ID: ${driverId}`);
    doc.text(`Vehicle ID: ${driver?.vehicle_id || "N/A"}`);
    doc.text(`City: ${driver?.city || "N/A"}`);
    doc.moveDown();

    // ✅ Table header
    doc.fontSize(12).text("Weekly Earnings Summary", { underline: true });
    doc.moveDown();

    // ✅ Draw table borders
    const tableTop = doc.y;
    const itemHeight = 20;

    // Table column positions
    const colWeek = 50;
    const colGross = 150;
    const colCommission = 250;
    const colNet = 350;
    const colStatus = 450;

    // Draw header row
    doc.rect(colWeek - 5, tableTop - 5, 450, itemHeight).stroke();
    doc.fontSize(10).text("Week", colWeek, tableTop);
    doc.text("Gross", colGross, tableTop);
    doc.text("Commission", colCommission, tableTop);
    doc.text("Net", colNet, tableTop);
    doc.text("Status", colStatus, tableTop);

    let y = tableTop + itemHeight;

    // Draw each row with borders
    rows.forEach((row) => {
      doc.rect(colWeek - 5, y - 5, 450, itemHeight).stroke();
      doc.text(row.week, colWeek, y);
      doc.text(row.gross, colGross, y);
      doc.text(row.commission, colCommission, y);
      doc.text(row.net, colNet, y);
      doc.text(row.payout_status, colStatus, y);
      y += itemHeight;
    });

    doc.moveDown();

    // ✅ Totals (sum net earnings)
    const totalNet = rows.reduce((sum, r) => sum + Number(r.net || 0), 0);
    doc.fontSize(12).text(`Total Net Payout: ${totalNet.toFixed(2)}`, { align: "right" });
    doc.moveDown();

    // ✅ Disclaimer
    doc.fontSize(10).text(
      "Disclaimer: This statement is generated by Songa Fleet Management. Actual payouts are subject to company policy.",
      { align: "center" }
    );

    // ✅ Finalize PDF
    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate statement" });
  }
});

// -----------------------------
// Finance Module Routes
// -----------------------------

//const express = require("express");
const router = express.Router();
const { Parser } = require("json2csv"); // ✅ for CSV export

// ✅ Export pending payouts as CSV
router.get("/finance/export-payouts", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT driver_id, week, net, payout_status FROM earnings WHERE payout_status = 'Pending'"
    );

    const fields = ["driver_id", "week", "net", "payout_status"];
    const parser = new Parser({ fields });
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("pending_payouts.csv");
    return res.send(csv);
  } catch (err) {
    console.error("Error exporting payouts:", err);
    res.status(500).json({ error: "Failed to export payouts" });
  }
});

// ✅ Mark payout as paid
router.post("/finance/mark-paid", async (req, res) => {
  const { driverId, week } = req.body;
  try {
    await db.query(
      "UPDATE earnings SET payout_status = 'Paid' WHERE driver_id = ? AND week = ?",
      [driverId, week]
    );
    res.json({ success: true, message: "Payout marked as paid" });
  } catch (err) {
    console.error("Error marking payout:", err);
    res.status(500).json({ error: "Failed to mark payout" });
  }
});

// ✅ View payout history
router.get("/finance/payout-history", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT driver_id, week, net, payout_status FROM earnings ORDER BY week DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching payout history:", err);
    res.status(500).json({ error: "Failed to fetch payout history" });
  }
});

module.exports = router;

// -----------------------------
// Finance Role-Based Access Middleware
// -----------------------------
function authorizeRole(requiredRole) {
  return (req, res, next) => {
    try {
      // ✅ Extract role from JWT (decoded earlier in auth middleware)
      const userRole = req.user.role; // assumes you set req.user in auth middleware

      if (userRole !== requiredRole) {
        return res.status(403).json({ error: "Access denied: insufficient role" });
      }

      next(); // ✅ allow access
    } catch (err) {
      console.error("Authorization error:", err);
      res.status(401).json({ error: "Unauthorized" });
    }
  };
}

// -----------------------------
// Audit Logging Helper
// -----------------------------
async function logAction(username, role, action, details) {
  try {
    await db.query(
      "INSERT INTO audit_logs (user, role, action, details) VALUES (?, ?, ?, ?)",
      [username, role, action, details]
    );
  } catch (err) {
    console.error("Failed to log action:", err);
  }
}

// ✅ Audit log route with pagination + filters
router.get("/audit-logs", authorizeRole("admin"), async (req, res) => {
  const { user, role, startDate, endDate, page = 1, limit = 20 } = req.query;

  let query = "SELECT * FROM audit_logs WHERE 1=1";
  const params = [];

  if (user) {
    query += " AND user = ?";
    params.push(user);
  }
  if (role) {
    query += " AND role = ?";
    params.push(role);
  }
  if (startDate) {
    query += " AND timestamp >= ?";
    params.push(startDate);
  }
  if (endDate) {
    query += " AND timestamp <= ?";
    params.push(endDate);
  }

  query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?";
  params.push(Number(limit));
  params.push((Number(page) - 1) * Number(limit));

  try {
    const [rows] = await db.query(query, params);

    // ✅ Get total count for pagination
    const [countRows] = await db.query("SELECT COUNT(*) as total FROM audit_logs");
    const total = countRows[0].total;

    res.json({
      logs: rows,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});



// Export filtered audit logs as CSV
//const { Parser } = require("json2csv");


router.get("/audit-logs/export", authorizeRole("admin"), async (req, res) => {
  const { user, role, startDate, endDate, page = 1, limit = 20  } = req.query;

  let query = "SELECT * FROM audit_logs WHERE 1=1";
  const params = [];

    // ✅ Apply filters if provided
  if (user) { query += " AND user = ?"; params.push(user); }
  if (role) { query += " AND role = ?"; params.push(role); }
  if (startDate) { query += " AND timestamp >= ?"; params.push(startDate); }
  if (endDate) { query += " AND timestamp <= ?"; params.push(endDate); }

// ✅ Pagination
  query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?";
  params.push(Number(limit));
  params.push((Number(page) - 1) * Number(limit));

 try {
    const [rows] = await db.query(query, params);

    // ✅ Count with same filters (so total matches filtered set)
    let countQuery = "SELECT COUNT(*) as total FROM audit_logs WHERE 1=1";
    const countParams = [];
    if (user) { countQuery += " AND user = ?"; countParams.push(user); }
    if (role) { countQuery += " AND role = ?"; countParams.push(role); }
    if (startDate) { countQuery += " AND timestamp >= ?"; countParams.push(startDate); }
    if (endDate) { countQuery += " AND timestamp <= ?"; countParams.push(endDate); }

    const [countRows] = await db.query(countQuery, countParams);
    const total = countRows[0].total;

    res.json({
      logs: rows,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

// ✅ Support audit logs with pagination
app.get("/support/audit-logs", authorizeRole("support"), async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  let query = "SELECT * FROM audit_logs WHERE role = 'support' ORDER BY timestamp DESC LIMIT ? OFFSET ?";
  const params = [Number(limit), (Number(page) - 1) * Number(limit)];

  try {
    const [rows] = await db.query(query, params);

    const [countRows] = await db.query("SELECT COUNT(*) as total FROM audit_logs WHERE role = 'support'");
    const total = countRows[0].total;

    res.json({
      logs: rows,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching support audit logs:", err);
    res.status(500).json({ error: "Failed to fetch support audit logs" });
  }
});

// ✅ Export support audit logs as CSV
app.get("/support/audit-logs/export", authorizeRole("support"), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM audit_logs WHERE role = 'support' ORDER BY timestamp DESC");

    const fields = ["id", "user", "role", "action", "details", "timestamp"];
    //const parser = new Parser({ fields });
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("support_audit_logs.csv");
    return res.send(csv);
  } catch (err) {
    console.error("Error exporting support audit logs:", err);
    res.status(500).json({ error: "Failed to export support audit logs" });
  }
});

// -----------------------------
// Support Module Routes (with audit logging)
// -----------------------------

// ✅ Create new issue (driver submits)
app.post("/support/issues", async (req, res) => {
  const { driverId, description } = req.body;
  try {
    await db.query(
      "INSERT INTO support_issues (driver_id, description) VALUES (?, ?)",
      [driverId, description]
    );

    // 🔒 Log action
    await logAction(req.user.username, req.user.role, "Issue Created", `Driver ${driverId}: ${description}`);

    res.json({ success: true, message: "Issue logged successfully" });
  } catch (err) {
    console.error("Error logging issue:", err);
    res.status(500).json({ error: "Failed to log issue" });
  }
});

// ✅ View all issues (support staff)
app.get("/support/issues", authorizeRole("support"), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM support_issues ORDER BY created_at DESC");

    // 🔒 Log action
    await logAction(req.user.username, req.user.role, "Viewed Issues", "Support staff viewed issue list");

    res.json(rows);
  } catch (err) {
    console.error("Error fetching issues:", err);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
});

// ✅ Resolve issue
app.post("/support/issues/:id/resolve", authorizeRole("support"), async (req, res) => {
  const { id } = req.params;
  const { resolutionNotes } = req.body;
  try {
    await db.query(
      "UPDATE support_issues SET status = 'Resolved', resolved_at = NOW(), resolution_notes = ? WHERE id = ?",
      [resolutionNotes, id]
    );

    // 🔒 Log action
    await logAction(req.user.username, req.user.role, "Issue Resolved", `Issue ${id} resolved with notes: ${resolutionNotes}`);

    res.json({ success: true, message: "Issue resolved" });
  } catch (err) {
    console.error("Error resolving issue:", err);
    res.status(500).json({ error: "Failed to resolve issue" });
  }
});

// ✅ Escalate issue
app.post("/support/issues/:id/escalate", authorizeRole("support"), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("UPDATE support_issues SET status = 'Escalated' WHERE id = ?", [id]);

    // 🔒 Log action
    await logAction(req.user.username, req.user.role, "Issue Escalated", `Issue ${id} escalated to Admin`);

    res.json({ success: true, message: "Issue escalated to Admin" });
  } catch (err) {
    console.error("Error escalating issue:", err);
    res.status(500).json({ error: "Failed to escalate issue" });
  }
});


// ✅ Get all drivers
app.get("/admin/drivers", authorizeRole("admin"), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM drivers ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching drivers:", err);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
});



//  Update driver
app.put("/admin/drivers/:id", authorizeRole("admin"), async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, cellNumber, vehicle_id, city } = req.body;
  try {
    await db.query(
      "UPDATE drivers SET first_name=?, last_name=?, email=?, cell_number=?, vehicle_id=?, city=? WHERE id=?",
      [firstName, lastName, email, cellNumber, vehicle_id, city, id]
    );
    await logAction(req.user.username, req.user.role, "Driver Updated", `Driver ${id} updated`);
    res.json({ success: true, message: "Driver updated successfully" });
  } catch (err) {
    console.error("Error updating driver:", err);
    res.status(500).json({ error: "Failed to update driver" });
  }
});

// Delete driver
app.delete("/admin/drivers/:id", authorizeRole("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM drivers WHERE id=?", [id]);
    await logAction(req.user.username, req.user.role, "Driver Deleted", `Driver ${id} deleted`);
    res.json({ success: true, message: "Driver deleted successfully" });
  } catch (err) {
    console.error("Error deleting driver:", err);
    res.status(500).json({ error: "Failed to delete driver" });
  }
});

// ✅ Get driver details + earnings
app.get("/admin/drivers/:id", authorizeRole("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const [driverRows] = await db.query("SELECT * FROM drivers WHERE id = ?", [id]);
    const driver = driverRows[0];

    const [earningsRows] = await db.query(
      "SELECT week, gross, commission, net, payout_status FROM earnings WHERE driver_id = ? ORDER BY week ASC",
      [id]
    );

    res.json({ driver, earnings: earningsRows });
  } catch (err) {
    console.error("Error fetching driver details:", err);
    res.status(500).json({ error: "Failed to fetch driver details" });
  }
});




// Serve React build 
app.use(express.static(path.join(__dirname, "build")));
// Start server once
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));