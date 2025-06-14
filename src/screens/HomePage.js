import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/HomePage.css';
import storeMapIcon from '../icons/store-map-icon.png';
import manageItemIcon from '../icons/manage-items-icon.png';
import inventoryIcon from '../icons/Inventory-icon.png';
import activeCartsIcon from '../icons/active-carts-icon.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-option" onClick={() => navigate('/manage-map')}>
          <img src={storeMapIcon} alt="Manage Store Map" />
          <p>Manage Store Map</p>
        </div>
        <div className="dashboard-option" onClick={() => navigate('/manage-item')}>
          <img src={manageItemIcon} alt="Manage Item" />
          <p>Manage Item</p>
        </div>
        <div className="dashboard-option" onClick={() => navigate('/manage-inventory')}>
          <img src={inventoryIcon} alt="Manage Inventory" />
          <p>Manage Inventory</p>
        </div>
        <div className="dashboard-option" onClick={() => navigate('/active-carts')}>
          <img src={activeCartsIcon} alt="Active Carts" />
          <p>Active Carts</p>
        </div>
      </div>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;
