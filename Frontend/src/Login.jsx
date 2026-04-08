import React, { useState } from "react";

export default function Login({ setUser }) {

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const API_URL = "https://adaptive-workload-system.onrender.com";

  const handleSubmit = async () => {
    // 🔴 validation
    if (!form.email || !form.password || (!isLogin && !form.username)) {
      alert("Please fill all fields ❗");
      return;
    }

    const url = isLogin
      ? `${API_URL}/api/login`
      : `${API_URL}/api/register`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        alert(isLogin ? "Login Success ✅" : "Registered Successfully ✅");

        if (isLogin) {
          // 🔥 VERY IMPORTANT (JWT FIX)
          localStorage.setItem("token", data.token);

          // Save user
          setUser(data.user);
        } else {
          setIsLogin(true);
        }

        // ✅ reset form
        setForm({
          username: "",
          email: "",
          password: ""
        });

      } else {
        alert(data.message || "Invalid credentials ❌");
      }

    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0B0F19",
      color: "white"
    }}>

      <div style={{
        background: "#111827",
        padding: "30px",
        borderRadius: "12px",
        width: "300px"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
        )}

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <button 
          onClick={handleSubmit} 
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "10px",
            background: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          style={{
            cursor: "pointer",
            marginTop: "15px",
            textAlign: "center",
            color: "#9CA3AF"
          }}
        >
          {isLogin ? "Create account" : "Already have account?"}
        </p>
      </div>
    </div>
  );
}