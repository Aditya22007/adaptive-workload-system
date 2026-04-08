const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// ===============================
// ✅ MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());


// ===============================
// ✅ DATABASE CONNECTION (FINAL FIX)
// ===============================
const dbUrl = new URL(process.env.DATABASE_URL);

const db = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port,
  waitForConnections: true,
  connectionLimit: 10,
}).promise();

console.log("✅ MySQL Connected (Parsed URL)");


// ===============================
// ❤️ TEST ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});


// ===============================
// 🚀 INSERT PERFORMANCE
// ===============================
app.post("/api/performance", async (req, res) => {
  try {
    const { productivity, accuracy } = req.body;

    const query = `
      INSERT INTO performance (productivity, accuracy)
      VALUES (?, ?)
    `;

    await db.query(query, [productivity, accuracy]);

    res.json({ success: true });

  } catch (err) {
    console.error("❌ INSERT ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ===============================
// 📊 GET HISTORY (WITH LEVEL)
// ===============================
app.get("/api/history", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM performance");

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

  } catch (err) {
    console.error("❌ FETCH ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ===============================
// 🚀 START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});