const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection (Railway / Render)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Connect DB
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});


// ===============================
// 🚀 POST PERFORMANCE (MAIN LOGIC)
// ===============================
app.post("/api/performance", (req, res) => {
  const { productivity, accuracy } = req.body;

  // 🎯 LEVEL LOGIC (IMPORTANT)
  let level = "Medium";

  if (productivity >= 85 && accuracy >= 85) {
    level = "Easy";
  } else if (productivity <= 60 || accuracy <= 60) {
    level = "Hard";
  }

  const query = `
    INSERT INTO performance (productivity, accuracy, level)
    VALUES (?, ?, ?)
  `;

  db.query(query, [productivity, accuracy, level], (err, result) => {
    if (err) {
      console.error("❌ Insert Error:", err);
      return res.status(500).json({ success: false, error: err });
    }

    res.json({ success: true, level });
  });
});


// ===============================
// 📊 GET HISTORY (FOR CHARTS)
// ===============================
app.get("/api/history", (req, res) => {
  const query = `
    SELECT productivity, accuracy, level
    FROM performance
    ORDER BY id DESC
    LIMIT 10
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Fetch Error:", err);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true, data: results });
  });
});


// ===============================
// ❤️ TEST ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


// ===============================
// 🚀 SERVER START
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});