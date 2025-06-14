import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import './css/ManageItems.css';

export default function ManageItems() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemData, setItemData] = useState({ itemId: '', name: '', price: '', image: '' });

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const data = [];
      querySnapshot.forEach(docSnap => data.push({ id: docSnap.id, ...docSnap.data() }));
      setItems(data);
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddOrUpdate = async () => {
    if (!itemData.itemId || !itemData.name || !itemData.price || !itemData.image) {
      alert('Please fill all fields.');
      return;
    }

    if (editingItemId) {
      // 🔁 Update existing item
      await updateDoc(doc(db, 'items', editingItemId), {
        itemId: itemData.itemId,
        name: itemData.name,
        price: parseFloat(itemData.price),
        image: itemData.image
      });

      setItems(prev =>
        prev.map(item =>
          item.id === editingItemId
            ? { ...item, ...itemData, price: parseFloat(itemData.price) }
            : item
        )
      );
      alert('Item updated!');
    } else {
      // ➕ Add new item
      const docRef = await addDoc(collection(db, 'items'), {
        itemId: itemData.itemId,
        name: itemData.name,
        price: parseFloat(itemData.price),
        image: itemData.image,
        inventory: 0,
        location: ''
      });

      setItems([
        ...items,
        { id: docRef.id, ...itemData, price: parseFloat(itemData.price), inventory: 0, location: '' }
      ]);
      alert('Item added!');
    }

    // Reset form
    setItemData({ itemId: '', name: '', price: '', image: '' });
    setEditingItemId(null);
    setShowForm(false);
  };

  const openUpdateForm = (item) => {
    setItemData({
      itemId: item.itemId,
      name: item.name,
      price: item.price.toString(),
      image: item.image
    });
    setEditingItemId(item.id);
    setShowForm(true);
  };

  return (
    <div className="manage-items-container">
      <h2>Manage Item</h2>

      <div className="top-bar">
        <input
          type="text"
          placeholder="🔍 Enter item name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => {
            setItemData({ itemId: '', name: '', price: '', image: '' });
            setEditingItemId(null);
            setShowForm(true);
          }}
        >
          Add New Item
        </button>
      </div>

      <div className="items-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="item-card" onClick={() => openUpdateForm(item)}>
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="add-form">
            <h3>{editingItemId ? 'Update Item' : 'Add New Item'}</h3>
            <input
              type="text"
              placeholder="Item ID (e.g. RFID)"
              value={itemData.itemId}
              onChange={(e) => setItemData({ ...itemData, itemId: e.target.value })}
            />
            <input
              type="text"
              placeholder="Item Name"
              value={itemData.name}
              onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Price"
              value={itemData.price}
              onChange={(e) => setItemData({ ...itemData, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={itemData.image}
              onChange={(e) => setItemData({ ...itemData, image: e.target.value })}
            />
            <div className="form-buttons">
              <button onClick={handleAddOrUpdate}>Save</button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setItemData({ itemId: '', name: '', price: '', image: '' });
                  setEditingItemId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
