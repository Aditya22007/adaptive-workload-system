const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ===============================
// ✅ MySQL POOL (FINAL FIX)
// ===============================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("✅ MySQL Pool Created");


// ===============================
// 🚀 POST PERFORMANCE
// ===============================
app.post("/api/performance", (req, res) => {
  const { productivity, accuracy } = req.body;

  const query = `
    INSERT INTO performance (productivity, accuracy)
    VALUES (?, ?)
  `;

  db.query(query, [productivity, accuracy], (err, result) => {
    if (err) {
      console.error("❌ Insert Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    res.json({ success: true });
  });
});


// ===============================
// 📊 GET HISTORY (FINAL)
// ===============================
app.get("/api/history", (req, res) => {
  const query = "SELECT * FROM performance";

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Fetch Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    // ✅ ADD LEVEL DYNAMICALLY
    const updatedResults = results.map((item) => {
      let level = "Medium";

      if (item.productivity >= 85 && item.accuracy >= 85) {
        level = "Easy";
      } else if (item.productivity <= 60 || item.accuracy <= 60) {
        level = "Hard";
      }

      return {
        ...item,
        level,
      };
    });

    res.json({ success: true, data: updatedResults });
  });
});


// ===============================
// ❤️ TEST ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("API running 🚀");
});


// ===============================
// 🚀 START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});