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

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // 🔥 FETCH DATA
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/data`, {
          headers: { Authorization: token }
        });

        const result = await res.json();
        if (result.success) setApiData(result.data);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);

  }, [user]);

  // 🔥 FETCH HISTORY
  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/history`, {
          headers: { Authorization: token }
        });

        const result = await res.json();
        if (result.success) setHistory(result.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchHistory();
  }, [user]);

  const data = history.map((item, i) => ({
    day: i + 1,
    value: item.productivity
  }));

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  if (!user) return <Login setUser={setUser} />;

  if (loading || !apiData) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
        color: "white"
      }}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "radial-gradient(circle at top, #0B0F19, #020617)",
      color: "white"
    }}>

      {/* Sidebar */}
      <div style={{
        width: "260px",
        padding: "25px",
        background: "linear-gradient(180deg,#0D1117,#020617)",
        borderRight: "1px solid #1f2937"
      }}>
        <h1 style={{ color: "#3B82F6", marginBottom: "40px" }}>⚡ AdaptIQ</h1>

        {["Dashboard", "AI Engine", "Live", "Tasks"].map((item, i) => (
          <p key={i}
            style={{
              color: i === 0 ? "#3B82F6" : "#9CA3AF",
              marginBottom: "20px",
              cursor: "pointer"
            }}>
            {item}
          </p>
        ))}

        <button onClick={handleLogout}
          style={{
            marginTop: "30px",
            background: "#EF4444",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            color: "white",
            width: "100%"
          }}>
          Logout
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "25px" }}>

        <h1>Welcome, {user.username} 👋</h1>

        {/* Cards */}
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          {[
            { title: "Level", value: apiData.level },
            { title: "Productivity", value: apiData.productivity + "%" },
            { title: "Accuracy", value: apiData.accuracy + "%" },
            { title: "Tasks", value: apiData.tasksCount },
          ].map((card, i) => (
            <div key={i}
              style={{
                flex: 1,
                padding: "20px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 0 20px rgba(59,130,246,0.2)",
                transition: "0.3s"
              }}>
              <p style={{ color: "#9CA3AF" }}>{card.title}</p>
              <h2>{card.value}</h2>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: "flex", gap: "20px", marginTop: "25px" }}>

          <div style={{
            flex: 2,
            padding: "20px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.05)"
          }}>
            <h2>📈 Performance</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <XAxis dataKey="day" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{
            flex: 1,
            padding: "20px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.05)"
          }}>
            <h2>Tasks</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie dataKey="value" data={[
                  { name: "Math", value: 30 },
                  { name: "Coding", value: 25 },
                  { name: "Logic", value: 20 },
                  { name: "Data", value: 25 }
                ]}>
                  {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Tasks */}
        <div style={{ marginTop: "25px" }}>
          <h2>🤖 AI Tasks</h2>

          <div style={{ display: "flex", gap: "20px" }}>
            {apiData.tasks.map((task, i) => (
              <div key={i}
                style={{
                  flex: 1,
                  padding: "20px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.05)",
                  boxShadow: "0 0 15px rgba(16,185,129,0.2)"
                }}>
                <p style={{ color: "#10B981" }}>{apiData.level}</p>
                <h3>{task}</h3>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}