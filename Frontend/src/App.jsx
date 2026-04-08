import Login from "./Login";
import { useEffect, useState } from "react";
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function App() {

  const API_URL = "https://adaptive-workload-system.onrender.com";

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [apiData, setApiData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // =============================
  // 🔐 SAVE USER
  // =============================
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // =============================
  // 🔥 FETCH REAL-TIME DATA (JWT)
  // =============================
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/data`, {
          headers: {
            Authorization: token
          }
        });

        const result = await res.json();

        if (result.success) {
          setApiData(result.data);
        } else {
          console.error("API failed:", result);
        }

      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [user]);

  // =============================
  // 🔥 FETCH HISTORY (JWT)
  // =============================
  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/history`, {
          headers: {
            Authorization: token
          }
        });

        const result = await res.json();

        if (result.success) {
          setHistory(result.data);
        }
      } catch (error) {
        console.error("History Error:", error);
      }
    };

    fetchHistory();
  }, [user]);

  // =============================
  // 📊 CHART DATA
  // =============================
  const data = history.map((item, index) => ({
    day: index + 1,
    value: item.productivity
  }));

  const pieData = [
    { name: "Math", value: 30 },
    { name: "Coding", value: 25 },
    { name: "Logic", value: 20 },
    { name: "Data", value: 25 },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  // =============================
  // 🔐 LOGIN SCREEN
  // =============================
  if (!user) {
    return <Login setUser={setUser} />;
  }

  // =============================
  // ⏳ LOADING SCREEN
  // =============================
  if (loading || !apiData) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0B0F19",
        color: "white"
      }}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  // =============================
  // 🚪 LOGOUT
  // =============================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // 🔥 IMPORTANT
    setUser(null);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0B0F19", color: "white" }}>
      
      {/* Sidebar */}
      <div style={{ width: "250px", background: "#0D1117", padding: "25px", borderRight: "1px solid #1f2937" }}>
        <h1 style={{ color: "#3B82F6", marginBottom: "30px" }}>
          AdaptIQ
        </h1>

        <p style={{ color: "#3B82F6" }}>Dashboard</p>
        <p style={{ color: "gray" }}>Adaptive Engine</p>
        <p style={{ color: "gray" }}>Live Session</p>
        <p style={{ color: "gray" }}>Tasks</p>

        <button 
          onClick={handleLogout}
          style={{
            marginTop: "30px",
            background: "#EF4444",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "25px" }}>
        
        <div>
          <h1>Welcome, {user.username || "User"} 👋</h1>
          <p style={{ color: "gray" }}>AI Adaptive Dashboard</p>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          {[
            { title: "Level", value: apiData.level },
            { title: "Productivity", value: apiData.productivity + "%" },
            { title: "Accuracy", value: apiData.accuracy + "%" },
            { title: "Tasks", value: apiData.tasksCount },
          ].map((card, i) => (
            <div key={i} style={{ background: "#111827", padding: "20px", borderRadius: "14px", flex: 1 }}>
              <p style={{ color: "gray" }}>{card.title}</p>
              <h2>{card.value}</h2>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: "flex", gap: "20px", marginTop: "25px" }}>
          
          <div style={{ background: "#111827", padding: "20px", borderRadius: "14px", flex: 2 }}>
            <h2>📈 Productivity History</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <XAxis dataKey="day" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "#111827", padding: "20px", borderRadius: "14px", flex: 1 }}>
            <h2>Task Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={80}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Tasks */}
        <div style={{ marginTop: "25px" }}>
          <h2>🤖 AI Recommended Tasks</h2>

          <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
            {apiData.tasks.map((task, i) => (
              <div key={i} style={{ background: "#111827", padding: "20px", borderRadius: "14px", flex: 1 }}>
                <p style={{ color: "#F59E0B" }}>{apiData.level}</p>
                <h3>{task}</h3>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}