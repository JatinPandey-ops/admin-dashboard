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
    <div className="dashboard-container">
      <h2 className="page-title">Home</h2>
        <div className="dashboard-body">
        <div className="dashboard-card" onClick={() => navigate('/manage-map')}>
          <img src={storeMapIcon} alt="Manage Store Map" />
          <h3>Manage Store Map</h3>
          <p>Update and visualize store layout with ease.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/manage-item')}>
          <img src={manageItemIcon} alt="Manage Item" />
          <h3>Manage Items</h3>
          <p>Add or edit product details quickly.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/manage-inventory')}>
          <img src={inventoryIcon} alt="Manage Inventory" />
          <h3>Manage Inventory</h3>
          <p>Track stock levels and update inventory.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
