import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Updated CSS for styling similar to Cart.js

const API_BASE = process.env.REACT_APP_API_BASE;

function Dashboard() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Please log in first.");
      navigate("/");
      return;
    }

    axios
      .get(`${API_BASE}/items/`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setItems(response.data))
      .catch((error) => {
        alert("Session expired. Please log in again.");
        navigate("/");
      });
  }, [navigate, token]);

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <a href="/dashboard" className="active">🏠 Dashboard</a>
        <a href="/cart">🛒 Cart</a>
        <button className="logout-button" onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}>🚪 Logout</button>
      </nav>

      <h1>🛍️ Available Items</h1>

      {items.length === 0 ? (
        <p className="empty-items">No items available 📦</p>
      ) : (
        <ul className="item-list">
          {items.map(item => (
            <li key={item.id} className="item">
              <span>📦 {item.name} - {item.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
