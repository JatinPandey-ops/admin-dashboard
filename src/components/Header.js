import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './css/Header.css';
import logo from '../icons/logo.png';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      alert('Error logging out. Try again.');
    }
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logo} alt="Logo" />
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/manage-map">Manage Map</Link>
        <Link to="/manage-item">Manage Items</Link>
        <Link to="/manage-inventory">Manage Inventory</Link>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </header>
  );
}
