// ManageStoreMap.js
import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';
import './css/ManageStoreMap.css';

export default function ManageStoreMap() {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedAisle, setSelectedAisle] = useState('');
  const [selectedShelf, setSelectedShelf] = useState('');

  const aisles = Array.from({ length: 5 }, (_, i) => `Aisle ${i + 1}`);
  const shelves = Array.from({ length: 3 }, (_, i) => `Shelf ${i + 1}`);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const data = [];
      querySnapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() });
      });
      setItems(data);
    };
    fetchItems();
  }, []);

  const handleUpdate = async () => {
    if (!selectedItemId || !selectedAisle || !selectedShelf) return;

    const location = `${selectedAisle}, ${selectedShelf}`;
    const itemRef = doc(db, 'items', selectedItemId);
    await updateDoc(itemRef, { location });

    const updatedItems = items.map(item =>
      item.id === selectedItemId ? { ...item, location } : item
    );
    setItems(updatedItems);
    setSelectedItemId('');
    setSelectedAisle('');
    setSelectedShelf('');
    alert('Location updated!');
  };

  // Build visual map matrix
  const mapMatrix = {};
  aisles.forEach(aisle => {
    mapMatrix[aisle] = {};
    shelves.forEach(shelf => {
      mapMatrix[aisle][shelf] = [];
    });
  });
  items.forEach(item => {
    const [aisle, shelf] = item.location.split(', ').map(str => str.trim());
    if (mapMatrix[aisle] && mapMatrix[aisle][shelf]) {
      mapMatrix[aisle][shelf].push(item.name);
    }
  });

  return (
    <div className="map-container">
      <h2>Manage Store Map</h2>

      <div className="visual-map">
        {aisles.map((aisle) => (
          <div key={aisle} className="aisle-column">
            <div className="aisle-title">{aisle}</div>
            {shelves.map((shelf) => (
              <div key={shelf} className="shelf-cell">
                <div className="shelf-title">{shelf}</div>
                <div className="shelf-grid">
                  {mapMatrix[aisle][shelf].map((itemName, idx) => (
                    <div key={idx} className="product-slot">{itemName}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="map-controls">
        <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)}>
          <option value="">Select Product</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        <select value={selectedAisle} onChange={(e) => setSelectedAisle(e.target.value)}>
          <option value="">Select Aisle</option>
          {aisles.map(aisle => (
            <option key={aisle} value={aisle}>{aisle}</option>
          ))}
        </select>

        <select value={selectedShelf} onChange={(e) => setSelectedShelf(e.target.value)}>
          <option value="">Select Shelf</option>
          {shelves.map(shelf => (
            <option key={shelf} value={shelf}>{shelf}</option>
          ))}
        </select>

        <button onClick={handleUpdate}>Update Location</button>
      </div>
    </div>
  );
}
