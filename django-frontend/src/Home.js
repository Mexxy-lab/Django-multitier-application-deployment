import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // CSS for styling

const API_BASE = process.env.REACT_APP_API_BASE; // Backend API URL

function Home() {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token"); // Get token from localStorage
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/items/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}, // Add auth header if token exists
      })
      .then((response) => {
        console.log("API Response:", response.data); // Debugging
        setItems(response.data);
      })
      .catch((error) => console.error("Error fetching items:", error));
  }, [token]);

  const addToCart = (itemId) => {
    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    axios
      .post(
        `${API_BASE}/cart/`,
        { item_id: itemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => alert("✅ Item added to cart!"))
      .catch((error) => alert("❌ Error adding item: " + error));
  };

  return (
    <div className="home-container">
      <nav className="home-nav">
        <a href="/">🏠 Home</a>
        <a href="/login">🔑 Login</a>
        <a href="/register">📝 Register</a>
        <a href="/dashboard">📊 Dashboard</a>
        <a href="/cart">🛒 Cart</a>
      </nav>

      <header className="home-header">
        <h1>🛍️ Welcome to Our Store</h1>
        <p>Find the best products at amazing prices!</p>
      </header>

      <div className="item-container">
        {items.length === 0 ? (
          <p className="empty-message">No items available.</p>
        ) : (
          <ul className="item-list">
            {items.map((item) => (
              <li key={item.id} className="item">
                <span>
                  📦 <strong>{item.name}</strong> - ${item.description} {/* Using description as price */}
                </span>
                <button className="add-to-cart" onClick={() => addToCart(item.id)}>
                  🛒 Add to Cart
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;
