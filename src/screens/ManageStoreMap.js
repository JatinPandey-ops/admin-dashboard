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
  const [selectedRow, setSelectedRow] = useState('');

  const aisles = [
    { key: 'Aisle 1', name: 'Beauty & Care' },
    { key: 'Aisle 2', name: 'Hardware & Electrical' },
    { key: 'Aisle 3', name: 'Household' },
    { key: 'Aisle 4', name: 'Sports' },
  ];
  const shelves = ['Shelf 1', 'Shelf 2', 'Shelf 3'];
  const rows = ['Row A', 'Row B', 'Row C'];

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
    if (!selectedItemId || !selectedAisle || !selectedShelf || !selectedRow) {
      alert('Please select all fields');
      return;
    }

    const location = `${selectedAisle}, ${selectedShelf}, ${selectedRow}`;
    const itemRef = doc(db, 'items', selectedItemId);
    await updateDoc(itemRef, { location });

    const updatedItems = items.map(item =>
      item.id === selectedItemId ? { ...item, location } : item
    );
    setItems(updatedItems);
    setSelectedItemId('');
    setSelectedAisle('');
    setSelectedShelf('');
    setSelectedRow('');
    alert('✅ Location updated!');
  };

  // Build visual map matrix with Rows
  const mapMatrix = {};
  aisles.forEach(aisle => {
    mapMatrix[aisle.key] = {};
    shelves.forEach(shelf => {
      mapMatrix[aisle.key][shelf] = {};
      rows.forEach(row => {
        mapMatrix[aisle.key][shelf][row] = [];
      });
    });
  });
  items.forEach(item => {
    const [aisle, shelf, row] = item.location?.split(', ').map(str => str.trim()) || [];
    if (mapMatrix[aisle]?.[shelf]?.[row]) {
      mapMatrix[aisle][shelf][row].push(item.name);
    }
  });

  return (
    <div className="map-container">
      <h2 className="page-title">Manage Store Map</h2>

      <div className="visual-map">
        {aisles.map((aisle) => (
          <div key={aisle.key} className="aisle-card">
            <div className="aisle-header">
              <h3>{aisle.key}</h3>
              <span className="aisle-category">{aisle.name}</span>
            </div>
            {shelves.map((shelf) => (
              <div key={shelf} className="shelf-block">
                <h4>{shelf}</h4>
                {rows.map((row) => (
                  <div key={row} className="row-block">
                    <span className="row-label">{row}</span>
                    <div className="row-items">
                      {mapMatrix[aisle.key][shelf][row].length === 0 ? (
                        <span className="empty-slot">Empty</span>
                      ) : (
                        mapMatrix[aisle.key][shelf][row].map((itemName, idx) => (
                          <span key={idx} className="item-pill">{itemName}</span>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="map-controls">
        <h4>Assign Product to Location</h4>
        <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)}>
          <option value="">Select Product</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        <select value={selectedAisle} onChange={(e) => setSelectedAisle(e.target.value)}>
          <option value="">Select Aisle</option>
          {aisles.map(aisle => (
            <option key={aisle.key} value={aisle.key}>
              {aisle.key} - {aisle.name}
            </option>
          ))}
        </select>

        <select value={selectedShelf} onChange={(e) => setSelectedShelf(e.target.value)}>
          <option value="">Select Shelf</option>
          {shelves.map(shelf => (
            <option key={shelf} value={shelf}>{shelf}</option>
          ))}
        </select>

        <select value={selectedRow} onChange={(e) => setSelectedRow(e.target.value)}>
          <option value="">Select Row</option>
          {rows.map(row => (
            <option key={row} value={row}>{row}</option>
          ))}
        </select>

        <button className="update-btn" onClick={handleUpdate}>Update Location</button>
      </div>
    </div>
  );
}
