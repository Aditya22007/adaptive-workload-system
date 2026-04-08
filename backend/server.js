const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || "mysecretkey";

// =============================
// 🔹 MySQL Connection
// =============================
const db = mysql.createConnection(process.env.DATABASE_URL);

let dbConnected = false;

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    dbConnected = true;
    console.log("✅ Connected to Railway MySQL");
  }
});

// =============================
// 🧠 AI ENGINE (NO AUTH)
// =============================
app.get("/api/data", (req, res) => {
  try {
    const productivity = Math.floor(Math.random() * 40) + 60;
    const accuracy = Math.floor(Math.random() * 30) + 60;

    let level = "Medium";

    if (productivity > 85 && accuracy > 85) level = "Hard";
    else if (productivity < 65 || accuracy < 65) level = "Easy";

    let tasks = [];

    if (level === "Easy") {
      tasks = ["Basic Math", "Simple Logic", "Beginner Coding"];
    } else if (level === "Medium") {
      tasks = ["Math", "Logic", "Coding"];
    } else {
      tasks = ["DSA Hard", "System Design", "Advanced Algorithms"];
    }

    const responseData = {
      productivity,
      accuracy,
      tasksCount: Math.floor(Math.random() * 20) + 5,
      level,
      tasks
    };

    console.log("Generated Data:", responseData);

    if (dbConnected) {
      const query = `
        INSERT INTO performance (productivity, accuracy, level)
        VALUES (?, ?, ?)
      `;

      db.query(query, [productivity, accuracy, level], (err) => {
        if (err) console.error("❌ DB Insert Error:", err.message);
      });
    }

    res.json({ success: true, data: responseData });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// =============================
// 📊 HISTORY API
// =============================
app.get("/api/history", (req, res) => {
  if (dbConnected) {
    db.query(
      "SELECT productivity, accuracy, created_at FROM performance ORDER BY id DESC LIMIT 10",
      (err, result) => {
        if (err) {
          console.error("❌ DB Fetch Error:", err.message);
          return res.status(500).json({ success: false });
        }

        res.json({ success: true, data: result.reverse() });
      }
    );
  } else {
    res.json({
      success: true,
      data: [
        { productivity: 70, accuracy: 75 },
        { productivity: 80, accuracy: 78 }
      ]
    });
  }
});

// =============================
// 👤 REGISTER (FIXED + DEBUG)
// =============================
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  console.log("📥 REGISTER REQUEST:", req.body); // 🔥 DEBUG

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields required"
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    db.query(query, [username, email, hashedPassword], (err) => {
      if (err) {
        console.error("❌ Registration Error:", err.message); // 🔥 IMPORTANT

        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      console.log("✅ User Registered:", email);

      res.json({
        success: true,
        message: "User registered successfully"
      });
    });

  } catch (err) {
    console.error("❌ Hash Error:", err);
    res.status(500).json({ success: false });
  }
});

// =============================
// 🔐 LOGIN (IMPROVED)
// =============================
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  console.log("📥 LOGIN REQUEST:", email); // 🔥 DEBUG

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], async (err, result) => {
    if (err) {
      console.error("❌ Login Error:", err.message);
      return res.status(500).json({ success: false });
    }

    if (result.length === 0) {
      console.log("❌ User not found");
      return res.json({ success: false, message: "User not found" });
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log("❌ Wrong password");
      return res.json({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });

    console.log("✅ Login success:", email);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  });
});

// =============================
// 🚀 START SERVER
// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});