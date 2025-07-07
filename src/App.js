// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './screens/AdminLogin';
import HomePage from './screens/HomePage';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ManageStoreMap from './screens/ManageStoreMap';
import ManageItems from './screens/ManageItem';
import ManageInventory from './screens/ManageInventory';
import Header from "./components/Header"

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe(); // cleanup
  }, []);

  return (
     <Router>
      {user && <Header />}
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <AdminLogin /> : <Navigate to="/" />} />
        <Route path="/manage-map" element={<ManageStoreMap />} />
        <Route path="/manage-item" element={<ManageItems />} />
        <Route path="/manage-inventory" element={<ManageInventory />} />
      </Routes>
    </Router>
  );
}

export default App;
