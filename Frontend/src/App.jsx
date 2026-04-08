import React, { useEffect, useState } from "react";
import Login from "./Login";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  const API_URL = "https://adaptive-workload-system.onrender.com";

  // 🔐 Auto login (token)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ username: "User" });
    }
  }, []);

  // 📊 Fetch current data
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/data`)
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            setData(res.data);
          }
        });

      fetch(`${API_URL}/api/history`)
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            setHistory(res.data);
          }
        });
    }
  }, [user]);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // 📊 Prepare chart data
  const chartData = history.map((item, index) => ({
    name: `#${index + 1}`,
    productivity: item.productivity,
    accuracy: item.accuracy
  }));

  // 🥧 Pie chart data
  const levelData = [
    {
      name: "Easy",
      value: history.filter(h => h.level === "Easy").length
    },
    {
      name: "Medium",
      value: history.filter(h => h.level === "Medium").length
    },
    {
      name: "Hard",
      value: history.filter(h => h.level === "Hard").length
    }
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF4444"];

  // 🔐 If not logged in
  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div style={{ padding: "20px", color: "white", background: "#0B0F19", minHeight: "100vh" }}>
      
      <h1>Welcome, {user.username} 👋</h1>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      {/* 📊 Current Performance */}
      {data && (
        <div style={{ marginBottom: "30px", background: "#111827", padding: "20px", borderRadius: "10px" }}>
          <h2>📊 Current Performance</h2>
          <p>Productivity: {data.productivity}</p>
          <p>Accuracy: {data.accuracy}</p>
          <p>Level: {data.level}</p>
          <p>Tasks Count: {data.tasksCount}</p>

          <h3>Tasks:</h3>
          <ul>
            {data.tasks.map((task, i) => (
              <li key={i}>{task}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 📈 Line Chart */}
      <div style={{ marginBottom: "30px", background: "#111827", padding: "20px", borderRadius: "10px" }}>
        <h2>📈 Performance History</h2>

        {history.length === 0 ? (
          <p>No history available</p>
        ) : (
          <LineChart width={500} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="productivity" stroke="#8884d8" />
            <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" />
          </LineChart>
        )}
      </div>

      {/* 🥧 Pie Chart */}
      <div style={{ background: "#111827", padding: "20px", borderRadius: "10px" }}>
        <h2>🥧 Performance Distribution</h2>

        <PieChart width={400} height={300}>
          <Pie
            data={levelData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {levelData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

    </div>
  );
}