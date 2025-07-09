import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import usePageTitle from '../hooks/usePageTitle';
import './css/ManageInventory.css';

export default function ManageInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'items'));
      const data = [];
      querySnapshot.forEach(docSnap =>
        data.push({ id: docSnap.id, ...docSnap.data() })
      );
      setItems(data);
      setLoading(false);
    };
    fetchItems();
  }, []);

  const handleInventoryChange = (id, value) => {
    if (value < 0) {
      alert('❌ Inventory cannot be negative!');
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, inventory: value } : item
      )
    );
  };

  const saveInventory = async (item) => {
    if (item.inventory < 0) {
      alert('❌ Cannot save negative inventory!');
      return;
    }
    const itemRef = doc(db, 'items', item.id);
    await updateDoc(itemRef, { inventory: parseInt(item.inventory) });
    alert(`✅ Inventory for "${item.name}" updated!`);
  };
   usePageTitle('Manage Inventory | MR.DIY Admin Dashboard');
  return (
    <div className="inventory-container">
      <h2 className="page-title">Manage Inventory</h2>
      {loading ? (
        <p className="loading-text">Loading items...</p>
      ) : (
        <div className="inventory-grid">
          {items.map(item => (
            <div key={item.id} className="inventory-card">
              <img src={item.image} alt={item.name} className="item-image" />
              <p className="item-name">{item.name}</p>
              <p className="current-inventory">Current: {item.inventory}</p>
              <input
                type="number"
                min="0"
                value={item.inventory}
                onChange={(e) =>
                  handleInventoryChange(item.id, parseInt(e.target.value))
                }
              />
              <button className="update-btn" onClick={() => saveInventory(item)}>Update</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
