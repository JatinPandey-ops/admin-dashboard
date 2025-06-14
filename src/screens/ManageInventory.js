import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
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
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, inventory: value } : item
      )
    );
  };

  const saveInventory = async (item) => {
    const itemRef = doc(db, 'items', item.id);
    await updateDoc(itemRef, { inventory: parseInt(item.inventory) });
    alert(`Inventory for "${item.name}" updated!`);
  };

  return (
    <div className="inventory-container">
      <h2>Manage Inventory</h2>
      {loading ? (
        <p>Loading items...</p>
      ) : (
        <div className="inventory-grid">
          {items.map(item => (
            <div key={item.id} className="inventory-card">
              <p className="item-name">{item.name}</p>
              <input
                type="number"
                value={item.inventory}
                onChange={(e) => handleInventoryChange(item.id, e.target.value)}
              />
              <button onClick={() => saveInventory(item)}>Update</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
