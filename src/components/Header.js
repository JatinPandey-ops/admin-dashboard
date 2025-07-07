import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './css/Header.css';
import logo from '../icons/logo.png';

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      alert('Error logging out. Try again.');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logo} alt="Logo" />
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span className={menuOpen ? "bar open" : "bar"}></span>
        <span className={menuOpen ? "bar open" : "bar"}></span>
        <span className={menuOpen ? "bar open" : "bar"}></span>
      </div>

      <nav className={`nav-links ${menuOpen ? 'mobile-open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/manage-map" onClick={() => setMenuOpen(false)}>Manage Map</Link>
        <Link to="/manage-item" onClick={() => setMenuOpen(false)}>Manage Items</Link>
        <Link to="/manage-inventory" onClick={() => setMenuOpen(false)}>Manage Inventory</Link>
        <button className="logout-btn mobile-logout" onClick={() => {handleLogout(); setMenuOpen(false);}}>Logout</button>
      </nav>

      {/* Desktop logout button */}
      <button className="logout-btn desktop-logout" onClick={handleLogout}>Logout</button>
    </header>
  );
}
