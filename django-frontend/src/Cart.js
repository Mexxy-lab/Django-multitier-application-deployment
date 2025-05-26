import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

const API_BASE = process.env.REACT_APP_API_BASE;

function Cart() {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("Please log in first.");
      return;
    }

    axios
      .get(`${API_BASE}/cart/`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setCart(response.data))
      .catch((error) => console.error("Error fetching cart:", error));
  }, [token]);

  const removeFromCart = (cartId) => {
    axios
      .delete(`${API_BASE}/cart/${cartId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setCart(cart.filter((item) => item.id !== cartId)))
      .catch((error) => console.error("Error removing item:", error));
  };

  const handlePayment = () => {
    navigate("/payment");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="cart-container">
      <nav className="cart-nav">
        <a href="/dashboard">🏠 Dashboard</a>
        <a href="/cart" className="active">🛒 Cart</a>
        <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
      </nav>

      <h1>🛍️ Your Cart</h1>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty 🛒</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <span>🍏 {item.item.name} - <strong>{item.quantity}</strong></span>
                <button className="remove-button" onClick={() => removeFromCart(item.id)}>❌ Remove</button>
              </li>
            ))}
          </ul>
          <div className="payment-button-container">
            <button className="payment-button" onClick={handlePayment}>
              💳 Make Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
