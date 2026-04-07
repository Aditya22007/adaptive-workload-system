import React, { useState } from "react";

export default function Login({ setUser }) {

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const API_URL = "https://adaptive-workload-system.onrender.com";

  const handleSubmit = () => {
    const url = isLogin
      ? `${API_URL}/api/login`
      : `${API_URL}/api/register`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(res => {
        if (res.success || res.message) {
          alert(isLogin ? "Login Success ✅" : "Registered Successfully ✅");

          if (isLogin) {
            setUser(res.user);
          } else {
            setIsLogin(true);
          }
        } else {
          alert(res.message || "Error ❌");
        }
      })
      .catch(() => {
        alert("Server error ❌");
      });
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

      <div style={{ background: "#111827", padding: "30px", borderRadius: "12px", width: "300px" }}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {!isLogin && (
          <input
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        )}

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={handleSubmit} style={{ marginTop: "10px", width: "100%" }}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          style={{ cursor: "pointer", marginTop: "10px", textAlign: "center" }}
        >
          {isLogin ? "Create account" : "Already have account?"}
        </p>
      </div>
    </div>
  );
}