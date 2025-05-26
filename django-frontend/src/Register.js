import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_BASE;

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/register/`, { username, password });
      alert("Registration successful! Please log in.");
      navigate("/");
    } catch (error) {
      alert("User already exists.");
    }
  };

  return (
    <div className="form-container">
      <h1>📝 Sign Up</h1> {/* Emoji Logo */}
      <p className="app-logo">🛍️ My Store</p> {/* App name with icon */}
      <form onSubmit={handleRegister}>
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
        <button type="submit" className="submit-button">Register</button>
      </form>
      <a href="/" className="form-link">Already have an account? Login</a>
    </div>
  );
}

export default Register;
