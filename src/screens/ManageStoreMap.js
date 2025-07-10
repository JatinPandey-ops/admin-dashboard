import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import './css/ManageStoreMap.css';
import usePageTitle from '../hooks/usePageTitle';

export default function ManageStoreMap() {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedAisle, setSelectedAisle] = useState('');
  const [selectedShelf, setSelectedShelf] = useState('');
  const [selectedRow, setSelectedRow] = useState('');
  const [mapUrl, setMapUrl] = useState('');

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

    const fetchMapUrl = async () => {
      const ref = doc(db, 'storemap', 'main');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setMapUrl(snap.data().url || '');
      }
    };

    fetchItems();
    fetchMapUrl();
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

  const handleDeleteLocation = async (itemId) => {
    const confirmDelete = window.confirm('Remove this item’s location?');
    if (!confirmDelete) return;

    const itemRef = doc(db, 'items', itemId);
    await updateDoc(itemRef, { location: '' });

    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, location: '' } : item
    );
    setItems(updatedItems);
    alert('❌ Location removed!');
  };

  const handleMapUrlSave = async () => {
    const ref = doc(db, 'storemap', 'main');
    await setDoc(ref, { url: mapUrl });
    alert('✅ Store map URL saved!');
  };

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
      mapMatrix[aisle][shelf][row].push({ name: item.name, id: item.id });
    }
  });

  usePageTitle('Store Map | MR.DIY Admin Dashboard');

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
                        mapMatrix[aisle.key][shelf][row].map((item, idx) => (
                          <span key={idx} className="item-pill">
                            {item.name}
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteLocation(item.id)}
                              title="Remove Location"
                            >
                              ×
                            </button>
                          </span>
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

        <h4>Store Map Image URL</h4>
        <input
          type="text"
          value={mapUrl}
          className='url_placeholder'
          onChange={(e) => setMapUrl(e.target.value)}
          placeholder="Enter store map image URL"
        />
        <button className="update-btn" onClick={handleUpdate}>Update Location</button>
        <button className="update-btn" onClick={handleMapUrlSave}>Save Map URL</button>
      </div>

      <div className="map-url-section">
      </div>
    </div>
  );
}
