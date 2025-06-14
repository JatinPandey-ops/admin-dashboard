import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './css/ActiveCarts.css';

export default function ActiveCarts() {
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    const fetchCarts = async () => {
      const querySnapshot = await getDocs(collection(db, 'carts'));
      const data = [];
      querySnapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setCarts(data);
    };
    fetchCarts();
  }, []);

  return (
    <div className="carts-container">
      <h2>Active Carts</h2>
      <div className="cart-list">
        {carts.map((cart, index) => (
          <div key={index} className="cart-card">
            <h3>Cart ID: {cart.cartId}</h3>
            <p>Status: <span className={cart.items[0]?.status === 'active' ? 'active' : 'closed'}>
              {cart.items[0]?.status || 'unknown'}
            </span></p>
            <div className="cart-items">
              {cart.items && cart.items.length > 0 ? (
                cart.items.map((item, i) => (
                  <div key={i} className="cart-item">
                    <p><strong>{item.name}</strong></p>
                    <p>Qty: {item.quantity}</p>
                    <p>Price: ₹{item.price}</p>
                  </div>
                ))
              ) : (
                <p>No items</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
