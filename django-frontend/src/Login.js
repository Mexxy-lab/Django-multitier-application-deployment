import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_BASE;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/login/`, { username, password });
      localStorage.setItem("token", response.data.access);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="form-container"> {/* Same as Register */}
      <div className="login-card">
        <h1>🔑 Sign In</h1>
        <p className="app-logo">🛍️ My Store</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="input-field"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-button">Login</button>
        </form>
        <a href="/register" className="form-link">Don't have an account? Sign up</a>
      </div>
    </div>
  );
}

export default Login;
