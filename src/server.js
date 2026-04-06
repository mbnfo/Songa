// server.js
// -----------------------------
// Express backend for Fleet Management
// Handles user creation and authentication
// -----------------------------

require("dotenv").config();
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db"); // import your MySQL pool
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");
const logAction = require("./utils/logAction");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const Papa = require("papaparse");
const router = express.Router();
const { Parser } = require("json2csv"); //  for CSV export

// ✅ Middleware first - CORS must be before routes
const allowedOrigins = [
  'http://localhost:3000', // local React dev server
  'http://localhost:3001', // local backend
  'https://songa.onrender.com', // deployed frontend
  'https://biasedly-abjective-brenden.ngrok-free.dev', // ngrok tunnel
  'https://songa.com.pl', // Songa domain home
];


const corsOptions = {
  origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy disallows origin: ${origin}`));
    }
  },
  credentials: true, //  allow cookies/authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //  allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], //  headers your frontend sends
};
app.use(cors(corsOptions));
app.options('', cors(corsOptions));

app.use(express.json()); // Parse JSON request bodies



// -----------------------------
// CSV UPLOAD ROUTE
// -----------------------------
app.post("/upload-csv", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    let fileContent = fs.readFileSync(filePath, "utf8");

    // Sanitize one-cell style input like
    fileContent = fileContent.trim();
    if (fileContent.toLowerCase().startsWith("data:")) {
      fileContent = fileContent.slice(5).trim();
    }
    fileContent = fileContent.replace(/\|$/, "").trim();

    const normalizeDriverId = (id) => {
      if (typeof id !== "string") return id;
      const cleaned = id.trim();
      // strip everything after the first colon, like "S0015:1" -> "S0015"
      return cleaned.replace(/:.+$/, "");
    };

    // First, try header-parsing csv (standard format)
    let rows = [];
    const parsedHeader = Papa.parse(fileContent, { header: true, skipEmptyLines: true, trim: true });

    if (parsedHeader.data && parsedHeader.data.length > 0) {
      const hasDriverId = parsedHeader.data.some((row) => row.driver_id || row.Driver_id || row.driver_id === 0);
      const headers = Object.keys(parsedHeader.data[0] || {}).map((k) => k.toLowerCase());
      const headerFields = ["driver_id", "week", "gross", "commission", "net", "payout_status"];

      if (hasDriverId || headerFields.every((field) => headers.includes(field))) {
        rows = parsedHeader.data;
      }
    }

    // Fallback: single-cell or no-header CSV
    if (!rows.length) {
      const parsedNoHeader = Papa.parse(fileContent, { header: false, skipEmptyLines: true, trim: true });
      if (parsedNoHeader.data && parsedNoHeader.data.length > 0) {
        rows = parsedNoHeader.data
          .map((rawRow) => {
            if (!rawRow || !rawRow.length) return null;
            let values = rawRow;

            // rawRow may be like ["S0015,Week1,1200.00,240.00,960.00,Pending"]
            if (rawRow.length === 1 && typeof rawRow[0] === "string" && rawRow[0].includes(",")) {
              values = rawRow[0].split(",").map((v) => v.trim());
            }

            if (values.length < 6) return null;

            return {
              driver_id: normalizeDriverId(values[0]),
              week: values[1],
              gross: values[2],
              commission: values[3],
              net: values[4],
              payout_status: values[5],
            };
          })
          .filter(Boolean);
      }
    }

    if (!rows.length) {
      return res.status(400).json({ error: "No valid CSV rows found" });
    }

    for (const row of rows) {
      if (!row || !row.driver_id) continue; // skip empty rows
      const driverId = normalizeDriverId(row.driver_id || row.Driver_id || row.driverId);
      if (!driverId) continue;

      await db.query(
        "INSERT INTO earnings (driver_id, week, gross, commission, net, payout_status) VALUES (?, ?, ?, ?, ?, ?)",
        [driverId, row.week, row.gross, row.commission, row.net, row.payout_status]
      );
    }

    res.json({ success: true, message: "CSV uploaded successfully!" });
  } catch (err) {
    console.error("CSV upload error:", err);
    res.status(500).json({ error: "CSV upload failed" });
  }
});

// authMiddleware.js
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

   // 🔐 Debug line: see what token is coming in
  console.log("🔐 Incoming token:", token);


  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "mysecret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = decoded; // attach decoded payload (id, role, driverId)
    next();
  });
} 
  //module.exports = authenticateToken;




app.use((req, res, next) => {
  //  This header tells ngrok to skip the browser warning page
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

//  Middleware first
app.use(cors()); // Allow cross-origin requests


app.use(express.json()); // Parse JSON request bodies

// 🔑 Debug line to check JWT_SECRET
if (process.env.JWT_SECRET) {
  console.log(" ✅JWT_SECRET loaded:", process.env.JWT_SECRET);
} else {
  console.log("❌ JWT_SECRET is missing!");
}




// -----------------------------
// User Registration Route
// -----------------------------
app.post("/register", async (req, res) => {
  const { username, password, role, driverId, firstName, lastName, cellNumber, email, id_passport, address, vehicle_id} = req.body;
  if (!username || !password || !role || !firstName || !lastName || !cellNumber || !email ||!id_passport|| !address) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    // Hash the password before saving
    const password_hash = await bcrypt.hash(password, 10);

     // Insert into users
    const [result] = await db.query(
      "INSERT INTO users (username, password_hash, role, driver_id, first_name, last_name, cell_number, email,id_passport,address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [username, password_hash, role, role === "driver" ? driverId : null, firstName, lastName, cellNumber, email,id_passport,address,  "Active"]
    );
          //Log user creation
        await db.query(
      "INSERT INTO audit_logs (user, role, action, details, timestamp) VALUES (?, ?, ?, ?, NOW())",
      [username, role, "Register", `New ${role} user ${username} registered`]
    );

    const userId = result.insertId;

    // If driver, also insert into drivers table
    if (role === "driver") {
      await db.query(
        "INSERT INTO drivers (user_id, vehicle_id) VALUES (?, ?)",
        [userId, vehicle_id || driverId]
      );
    }

    res.json({ message: "User registered successfully!" });
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
    //Token defensive
    if (!user.role) {
        return res.status(500).json({ error: "User role missing in database" });
      }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, driverId: user.driver_id },
      process.env.JWT_SECRET || "mysecret",
      { expiresIn: "1h" }
    );

    // Log the login event into audit_logs
    await db.query(
      "INSERT INTO audit_logs (user, role, action, details, timestamp) VALUES (?, ?, ?, ?, NOW())",
      [user.username, user.role, "Login", `User ${user.username} logged in`]
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
              CONCAT(d.first_name, ' ', d.last_name) AS driver_name,
              e.week,
              e.gross,
              e.commission,
              e.net,
              e.payout_status
            FROM earnings e
            LEFT JOIN drivers d ON e.driver_id = d.id
            ORDER BY e.week ASC
    `);
    
    console.log(" Dashboard rows:", rows);
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
const PDFDocument = require("pdfkit"); // PDF generation library
const crypto = require("crypto");      // For generating unique statement IDs
// const path = require("path");

app.get("/driver-statement/:driverId", authenticateToken, async (req, res) => {
  const { driverId } = req.params;

  try {
    //  Fetch driver info (first_name, last_name, vehicle, city) from drivers table
    const [driverRows] = await db.query(
      "SELECT first_name, last_name, vehicle_id, city FROM drivers WHERE id = ?",
      [driverId]
    );
    const driver = driverRows[0];

    // 2️⃣ Fetch weekly earnings
    const [rows] = await db.query(
      "SELECT week, gross, commission, net, payout_status FROM earnings WHERE driver_id = ? ORDER BY week ASC",
      [driverId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "No earnings found for this driver" });
    }

    // 3️⃣ Generate Statement ID
    const statementId = `SONGA-${driverId}-${crypto.randomBytes(4).toString("hex")}`;

    // 4️⃣ Date range
    const startWeek = rows[0].week;
    const endWeek = rows[rows.length - 1].week;

    // 5️⃣ Set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=statement_${driverId}.pdf`);

    // 6️⃣ Create PDF
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Company logo
    const logoPath = path.join(__dirname, "assets", "New_Songa_Logo.png");
    try {
      doc.image(logoPath, 50, 40, { width: 80 });
    } catch (err) {
      console.warn("Logo not found, skipping image.");
    }

    // Company header
    doc.fontSize(20).text("Songa Fleet Management", 150, 50);
    doc.moveDown();
    doc.fontSize(14).text("Weekly Driver Earnings Statement", { align: "center" });
    doc.moveDown();

    // Statement metadata
    doc.fontSize(12).text(`Statement ID: ${statementId}`);
    doc.text(`Period: ${startWeek} to ${endWeek}`);
    doc.moveDown();

    //  Driver info section
    doc.fontSize(12).text(`Driver Name: ${driver?.first_name} ${driver?.last_name || "N/A"}`);
    doc.text(`Driver ID: ${driverId}`);
    doc.text(`Vehicle ID: ${driver?.vehicle_id || "N/A"}`);
    doc.text(`City: ${driver?.city || "N/A"}`);
    doc.moveDown();

    // Table header
    doc.fontSize(12).text("Weekly Earnings Summary", { underline: true });
    doc.moveDown();

    // Table columns
    const tableTop = doc.y;
    const itemHeight = 20;
    const colWeek = 50, colGross = 150, colCommission = 250, colNet = 350, colStatus = 450;

    // Header row
    doc.rect(colWeek - 5, tableTop - 5, 450, itemHeight).stroke();
    doc.fontSize(10).text("Week", colWeek, tableTop);
    doc.text("Gross", colGross, tableTop);
    doc.text("Commission", colCommission, tableTop);
    doc.text("Net", colNet, tableTop);
    doc.text("Status", colStatus, tableTop);

    let y = tableTop + itemHeight;

    // Rows
    rows.forEach((row) => {
      doc.rect(colWeek - 5, y - 5, 450, itemHeight).stroke();
      doc.text(row.week, colWeek, y);
      // 7️⃣ Align numbers neatly
      doc.text(Number(row.gross).toFixed(2), colGross, y, { width: 80, align: "right" });
      doc.text(Number(row.commission).toFixed(2), colCommission, y, { width: 80, align: "right" });
      doc.text(Number(row.net).toFixed(2), colNet, y, { width: 80, align: "right" });
      doc.text(row.payout_status, colStatus, y);
      y += itemHeight;
    });

    doc.moveDown();

    // 8️⃣ Totals section
    const totalGross = rows.reduce((sum, r) => sum + Number(r.gross || 0), 0);
    const totalCommission = rows.reduce((sum, r) => sum + Number(r.commission || 0), 0);
    const totalNet = rows.reduce((sum, r) => sum + Number(r.net || 0), 0);

    doc.fontSize(12).text(`Total Gross: $${totalGross.toFixed(2)}`);
    doc.text(`Total Commission: $${totalCommission.toFixed(2)}`);
    doc.text(`Total Net Payout: $${totalNet.toFixed(2)}`, { align: "right" });
    doc.moveDown();

    // Disclaimer
    doc.fontSize(10).text(
      "Disclaimer: This statement is generated by Songa Fleet Management. Actual payouts are subject to company policy.",
      { align: "center" }
    );

    // 9️⃣ Audit log
    await logAction(
      req.user?.username || "Driver",
      req.user?.role || "driver",
      "Downloaded PDF Statement",
      `Driver ${driverId} downloaded statement ${statementId}`
    );

    // Finalize
    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate statement" });
  }
});


// -----------------------------
// Finance & Owner Role-Based Access Middleware (supports single OR multiple roles)
// Note: This runs AFTER authenticateToken, so req.user is already set
// -----------------------------
function authorizeRole(requiredRoles) {
  return (req, res, next) => {
    try {
      // Extract role from JWT payload (set earlier in authenticateToken middleware)
      const userRole = req.user?.role?.toLowerCase();

      // Normalize requiredRoles into an array of lowercase strings
      const allowedRoles = Array.isArray(requiredRoles)
        ? requiredRoles.map(r => r.toLowerCase())
        : [requiredRoles.toLowerCase()];

      // Check if the user's role is in the allowed list
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: "Access denied: insufficient role" });
      }

      console.log("✅ Role authorized:", userRole, "- allowed roles:", allowedRoles);

      // If role is allowed, continue to the next middleware/route
      next();
    } catch (err) {
      console.error("Authorization error:", err);
      res.status(401).json({ error: "Unauthorized" });
    }
  };
}

// -----------------------------
// Finance Module Routes
// -----------------------------


// Export pending payouts as CSV
router.get("/finance/export-payouts", authenticateToken, authorizeRole(["finance", "owner"]), async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT driver_id, week, net, payout_status FROM earnings WHERE payout_status = 'Pending'"
    );

     // 🔒 Log action
    await logAction(req.user.username, req.user.role, "Exported Payouts", "Finance exported pending payouts as CSV");


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

//  Mark payout as paid
router.post("/finance/mark-paid", authenticateToken, authorizeRole(["finance", "owner"]), async (req, res) => {
  const { driverId, week } = req.body;
  try {
    await db.query(
      "UPDATE earnings SET payout_status = 'Paid' WHERE driver_id = ? AND week = ?",
      [driverId, week]
    );

     // 🔒 Log action
    await logAction(req.user.username, req.user.role, "Payout Marked Paid", `Driver ${driverId}, Week ${week}`);

    res.json({ success: true, message: "Payout marked as paid" });
  } catch (err) {
    console.error("Error marking payout:", err);
    res.status(500).json({ error: "Failed to mark payout" });
  }
});

// View payout history
router.get("/finance/payout-history", authenticateToken,  authorizeRole(["finance", "owner"]), async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT DISTINCT driver_id, week, gross, commission, net, payout_status FROM earnings ORDER BY week DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching payout history:", err);
    res.status(500).json({ error: "Failed to fetch payout history" });
  }
});

module.exports = router;



// -----------------------------
// CSV PARSING
// -----------------------------
app.post("/upload-csv", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    console.log("Upload route hit, file:", req.file);

    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Parse CSV
    const parsed = Papa.parse(fileContent, { header: true });
    const rows = parsed.data;

    for (const row of rows) {
        if (!row.driver_id) continue; // skip empty rows
        await db.query(
          "INSERT INTO earnings (driver_id, week, gross, commission, net, payout_status) VALUES (?, ?, ?, ?, ?, ?)",
          [row.driver_id, row.week, row.gross, row.commission, row.net, row.payout_status]
        );
      }

    res.json({ success: true, message: "CSV uploaded successfully!" });
  } catch (err) {
    console.error("CSV upload error:", err);
    res.status(500).json({ error: "CSV upload failed" });
  }
});

// -----------------------------
// Audit Logging Helper
// -----------------------------

// Audit log route with pagination + filters
router.get(
  "/audit-logs",
  authenticateToken,          //  first check JWT
  authorizeRole("owner"),     // then check role
  async (req, res) => {

  const { user, role, startDate, endDate, page = 1, limit = 20 } = req.query;

  let query = "SELECT * FROM audit_logs WHERE 1=1";
  const params = [];

  if (user && user !== "All") {
  query += " AND user = ?";
  params.push(user);  
  }  

  if (role && role !== "All") {
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
    //  Get total count for pagination
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



router.get("/audit-logs/export",  authenticateToken, authorizeRole("owner"), async (req, res) => {
  const { user, role, startDate, endDate, page = 1, limit = 20  } = req.query;

  let query = "SELECT * FROM audit_logs WHERE 1=1";
  const params = [];

    //  Apply filters if provided
  if (user) { query += " AND user = ?"; params.push(user); }
  if (role) { query += " AND role = ?"; params.push(role); }
  if (startDate) { query += " AND timestamp >= ?"; params.push(startDate); }
  if (endDate) { query += " AND timestamp <= ?"; params.push(endDate); }

//  Pagination
  query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?";
  params.push(Number(limit));
  params.push((Number(page) - 1) * Number(limit));

 try {
    const [rows] = await db.query(query, params);

    //  Count with same filters (so total matches filtered set)
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

//  Support audit logs with pagination
app.get("/support/audit-logs",  authenticateToken, authorizeRole("support"), async (req, res) => {
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

//  Export support audit logs as CSV
app.get("/support/audit-logs/export",  authenticateToken, authorizeRole("support"), async (req, res) => {
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


// ✅ Create new issue (any role can submit)
app.post("/support/issues", authenticateToken, async (req, res) => {
  const { userId, description } = req.body;
  const issueUserId = userId || req.user?.id;
  const issueRole = req.user?.role || "driver";
  const issueDriverId = 999999; // impossible driver ID per request

  try {
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }
    if (!issueUserId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Save issue with user info (body userId or authenticated user)
    // Try driver_id column first; if not present, fallback to schema without it
    try {
      await db.query(
        "INSERT INTO support_issues (user_id, driver_id, role, description, status, created_at) VALUES (?, ?, ?, ?, 'Open', NOW())",
        [issueUserId, issueDriverId, issueRole, description]
      );
    } catch (insertErr) {
      if (insertErr.code === "ER_BAD_FIELD_ERROR" && insertErr.sqlMessage.includes("driver_id")) {
        await db.query(
          "INSERT INTO support_issues (user_id, role, description, status, created_at) VALUES (?, ?, ?, 'Open', NOW())",
          [issueUserId, issueRole, description]
        );
      } else {
        throw insertErr;
      }
    }

     // 🔒 Log action
    await logAction(
      req.user?.username || `userId:${issueUserId}`,
      issueRole,
      "Issue Created",
      `${req.user.role} ${req.user.id}: ${description}`
    );


    res.json({ success: true, message: "Issue logged successfully" });
  } catch (err) {
    console.error("Error logging issue:", err);
    res.status(500).json({ error: "Failed to log issue" });
  }
});



//  View all issues (support staff)
app.get("/support/issues",  authenticateToken, authorizeRole("support"), async (req, res) => {
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

//  Resolve issue
app.post("/support/issues/:id/resolve",  authenticateToken, authorizeRole("support"), async (req, res) => {
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

// ✅ Escalate issue with reason
    app.post("/support/issues/:id/escalate", authenticateToken, authorizeRole("support"), async (req, res) => {
      const { id } = req.params;
      const { reason } = req.body;
      try {
        await db.query(
          "UPDATE support_issues SET status = 'Escalated', reason = ? WHERE id = ?",
          [reason, id]
        );


    // 🔒 Log action
    await logAction(
      req.user.username,
      req.user.role,
      "Issue Escalated",
      `Issue ${id} escalated with reason: ${reason}`
    );

    res.json({ success: true, message: "Issue escalated to Admin" });
  } catch (err) {
    console.error("Error escalating issue:", err);
    res.status(500).json({ error: "Failed to escalate issue" });
  }
});

// -----------------------------
// Driver: View own issues
// -----------------------------
app.get("/support/issues/driver/:driverId", authenticateToken, authorizeRole("driver"), async (req, res) => {
  const { driverId } = req.params;

  try {
    // ✅ Only fetch issues belonging to this driver
    const [rows] = await db.query(
      "SELECT id, description, status, resolution_notes, reason, created_at, resolved_at, escalated_at FROM support_issues WHERE user_id = ? ORDER BY created_at DESC",
      [driverId]
    );

    // 🔒 Log action
    await logAction(
      req.user.username,
      req.user.role,
      "Viewed Own Issues",
      `Driver ${driverId} viewed their support issues`
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching driver issues:", err);
    res.status(500).json({ error: "Failed to fetch driver issues" });
  }
});




// OWNER -  Get all drivers
app.get("/owner/drivers",  authenticateToken, authorizeRole("owner"), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM drivers ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching drivers:", err);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
});





//  OWNER - Update driver
app.put("/owner/drivers/:id",  authenticateToken, authorizeRole("owner"), async (req, res) => {
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

// OWNER -  Delete driver
app.delete("/owner/drivers/:id",  authenticateToken, authorizeRole("owner"), async (req, res) => {
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


//  ADMIN - Get driver details + earnings
app.get("/admin/drivers/:id",  authenticateToken, authorizeRole("admin"), async (req, res) => {
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

app.put("/admin/drivers/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, cellNumber, vehicle_id, city, status } = req.body;
  try {
    await db.query(
      "UPDATE drivers SET first_name=?, last_name=?, email=?, cell_number=?, vehicle_id=?, city=?, status=? WHERE id=?",
      [firstName, lastName, email, cellNumber, vehicle_id, city, status, id]
    );
    await logAction(req.user.username, req.user.role, "Driver Updated", `Driver ${id} updated`);
    res.json({ success: true, message: "Driver updated successfully" });
  } catch (err) {
    console.error("Error updating driver:", err);
    res.status(500).json({ error: "Failed to update driver" });
  }
});

// OWNER - Get driver details + earnings
app.get("/owner/drivers/:id",  authenticateToken, authorizeRole("owner"), async (req, res) => {
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

app.put("/owner/drivers/:id",  authenticateToken, authorizeRole("owner"), async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, cellNumber, vehicle_id, city, status } = req.body;
  try {
    await db.query(
      "UPDATE drivers SET first_name=?, last_name=?, email=?, cell_number=?, vehicle_id=?, city=?, status=? WHERE id=?",
      [firstName, lastName, email, cellNumber, vehicle_id, city, status, id]
    );
    await logAction(req.user.username, req.user.role, "Driver Updated", `Driver ${id} updated`);
    res.json({ success: true, message: "Driver updated successfully" });
  } catch (err) {
    console.error("Error updating driver:", err);
    res.status(500).json({ error: "Failed to update driver" });
  }
});




// -----------------------------
// Driver Dashboard route used by driverDashboard component
// -----------------------------
app.get("/driver-dashboard/:driverId", authenticateToken,  async (req, res) => {
  let driverId = (req.params.driverId || "").toString().trim();

  // Fallback from parsed token if route param is bad/empty
  if (!driverId && req.user) {
    driverId = (req.user.driverId || req.user.id || "").toString();
  }

  try {
    let [driverRows] = [ [] ];

    if (/^\d+$/.test(driverId)) {
      [driverRows] = await db.query("SELECT * FROM drivers WHERE id = ? OR user_id = ?", [driverId, driverId]);
    }

    if (!driverRows.length) {
      [driverRows] = await db.query("SELECT * FROM drivers WHERE vehicle_id = ?", [driverId]);
    }

    // If we got here, first try vehicle_id matching (for non-numeric strings)
    if (!driverRows.length) {
      [driverRows] = await db.query("SELECT * FROM drivers WHERE vehicle_id = ?", [driverId]);
    }

    // As requested: prefer direct driverId resolution, not user_id path.
    if (!driverRows.length) {
      const [earningsRowsFromEarnings] = await db.query(
        "SELECT week, gross, commission, net, payout_status FROM earnings WHERE driver_id = ? ORDER BY week ASC",
        [driverId]
      );
      if (earningsRowsFromEarnings.length) {
        return res.json(earningsRowsFromEarnings);
      }
      return res.status(404).json({ error: "Driver not found" });
    }

    const driver = driverRows[0];
    const [earningsRows] = await db.query(
      "SELECT week, gross, commission, net, payout_status FROM earnings WHERE driver_id = ? ORDER BY week ASC",
      [driver.id]
    );

    return res.json(earningsRows);
  } catch (err) {
    console.error("Error fetching driver dashboard:", err);
    return res.status(500).json({ error: "Failed to fetch driver dashboard" });
  }
});


//  Download My Data (Driver GDPR)
app.get("/driver/data/:driverId",  authenticateToken, authorizeRole("driver"), async (req, res) => {
  const { driverId } = req.params;
  try {
    // Fetch driver profile
    const [driverRows] = await db.query("SELECT * FROM drivers WHERE id = ?", [driverId]);
    const driver = driverRows[0];

    // Fetch driver earnings
    const [earningsRows] = await db.query(
      "SELECT week, gross, commission, net, payout_status FROM earnings WHERE driver_id = ? ORDER BY week ASC",
      [driverId]
    );

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // 🔒 Log action
    await logAction(req.user.username, req.user.role, "Downloaded Data", `Driver ${driverId} downloaded their data`);

    res.json({ driver, earnings: earningsRows });
  } catch (err) {
    console.error("Error fetching driver data:", err);
    res.status(500).json({ error: "Failed to fetch driver data" });
  }
});

//  Delete My Account (Driver GDPR)
app.delete("/driver/delete/:driverId",  authenticateToken, authorizeRole("driver"), async (req, res) => {
  const { driverId } = req.params;
  try {
    // Delete driver record
    await db.query("DELETE FROM drivers WHERE id = ?", [driverId]);
    await db.query("DELETE FROM earnings WHERE driver_id = ?", [driverId]);

    // 🔒 Log action
    await logAction(req.user.username, req.user.role, "Account Deleted", `Driver ${driverId} requested account deletion`);

    res.json({ success: true, message: "Driver account deleted successfully" });
  } catch (err) {
    console.error("Error deleting driver account:", err);
    res.status(500).json({ error: "Failed to delete driver account" });
  }
});


// OWNER - Update user status
app.put("/owner/users/:id/status", authenticateToken, authorizeRole("owner"), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query("UPDATE users SET status=? WHERE id=?", [status, id]);
    //Log user status update
    await db.query(
      "INSERT INTO audit_logs (user, role, action, details, timestamp) VALUES (?, ?, ?, ?, NOW())",
      [req.user.id, req.user.role, "Status Update", `Changed status of user ${id} to ${status}`]
    );
    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }});
    

// ONWER - Delete user
app.delete("/owner/users/:id", authenticateToken, authorizeRole("owner"), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE id=?", [id]);

    //Log user deletion
      await db.query(
        "INSERT INTO audit_logs (user, role, action, details, timestamp) VALUES (?, ?, ?, ?, NOW())",
        [req.user.id, req.user.role, "Delete User", `Deleted user ${id}`]
      );

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});
       


// Get all users
app.get("/users", authenticateToken, (req, res) => {
  //  Only allow owner or admin roles
  if (req.user.role !== "owner" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  //  Fetch all users
  db.query("SELECT id, username, role, first_name, last_name, cell_number, email, address, id_passport, status FROM users")
    .then(([rows]) => res.json(rows))
    .catch(err => res.status(500).json({ error: "Failed to fetch users" }));
});



// Serve React build 
app.use(express.static(path.join(__dirname, "../build")));



// Mount router for finance and audit logs   
 app.use("/", router);


// Catch-all handler: send back index.html for any non-API routes (for React Router)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') &&
  !req.path.startsWith('/support') && 
  !req.path.startsWith('/admin') &&
   !req.path.startsWith('/finance') && 
   !req.path.startsWith('/audit-logs') && 
   !req.path.startsWith('/driver-statement')) 
   {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  } else {
    next();
  }
});

// Start server once
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));