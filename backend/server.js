const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ DB Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB ERROR:", err);
  } else {
    console.log("✅ DB Connected");
  }
});


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
      return res.status(500).json({ success: false });
    }

    res.json({ success: true });
  });
});


// ===============================
// 📊 GET HISTORY (FINAL FIX)
// ===============================
app.get("/api/history", (req, res) => {
  const query = "SELECT * FROM performance";

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Fetch Error:", err);
      return res.status(500).json({ success: false });
    }

    // ✅ ADD LEVEL DYNAMICALLY (NO DB DEPENDENCY)
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
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});