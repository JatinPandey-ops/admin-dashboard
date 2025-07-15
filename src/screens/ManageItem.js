import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, getDoc, setDoc, deleteDoc, doc } from 'firebase/firestore';
import './css/ManageItems.css';
import usePageTitle from '../hooks/usePageTitle';

export default function ManageItems() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemData, setItemData] = useState({ itemId: '', name: '', price: '', image: '' });

  usePageTitle('Manage Items | MR.DIY Admin Dashboard');

  // Fetch all items from Firestore
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

  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Add or update item
  const handleAddOrUpdate = async () => {
    if (!itemData.itemId || !itemData.name || !itemData.price || !itemData.image) {
      alert('⚠️ Please fill all fields.');
      return;
    }

    const upperItemId = itemData.itemId.trim().toUpperCase();
    const newDocRef = doc(db, 'items', upperItemId);

    try {
      let preservedFields = {
        inventory: 0,
        location: '',
      };

      if (editingItemId) {
        if (editingItemId !== upperItemId) {
          // Fetch old doc data to preserve fields
          const oldDocRef = doc(db, 'items', editingItemId);
          const oldDocSnap = await getDoc(oldDocRef);
          if (oldDocSnap.exists()) {
            const oldData = oldDocSnap.data();
            preservedFields = {
              inventory: oldData.inventory ?? 0,
              location: oldData.location ?? '',
            };
          }

          // Delete old doc
          await deleteDoc(oldDocRef);
          console.log(`Deleted old doc with ID: ${editingItemId}`);
        } else {
          // Preserve fields if ID hasn’t changed
          const currentItem = items.find(item => item.id === editingItemId);
          preservedFields = {
            inventory: currentItem?.inventory ?? 0,
            location: currentItem?.location ?? '',
          };
        }
      }

      // Create new doc (with preserved fields)
      await setDoc(newDocRef, {
        itemId: upperItemId,
        name: itemData.name,
        price: parseFloat(itemData.price),
        image: itemData.image,
        inventory: preservedFields.inventory,
        location: preservedFields.location,
      });

      // Update state
      if (editingItemId) {
        setItems(prev =>
          prev.map(item =>
            item.id === editingItemId
              ? { ...item, ...itemData, id: upperItemId, itemId: upperItemId, price: parseFloat(itemData.price), ...preservedFields }
              : item
          )
        );
        alert('✅ Item updated!');
      } else {
        setItems(prev => [
          ...prev,
          {
            id: upperItemId,
            ...itemData,
            itemId: upperItemId,
            price: parseFloat(itemData.price),
            ...preservedFields,
          },
        ]);
        alert('✅ Item added!');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('⚠️ Failed to save item.');
    }

    // Reset and close drawer
    setItemData({ itemId: '', name: '', price: '', image: '' });
    setEditingItemId(null);
    setDrawerOpen(false);
  };

  // Open drawer for edit
  const openDrawer = (item) => {
    setItemData({
      itemId: item.itemId,
      name: item.name,
      price: item.price.toFixed(2), // Format price for input
      image: item.image,
    });
    setEditingItemId(item.id);
    setDrawerOpen(true);
  };

  // Delete item
  const deleteItem = async (id, name) => {
    const confirmDelete = window.confirm(`🗑️ Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'items', id));
      setItems(prev => prev.filter(item => item.id !== id));
      alert(`✅ "${name}" deleted successfully!`);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('⚠️ Failed to delete item.');
    }
  };

  return (
    <div className="manage-items-container">
      <h2 className="page-title">Manage Items</h2>

      {/* Top bar with search and add button */}
      <div className="top-bar">
        <input
          type="text"
          placeholder="🔍 Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="add-btn" onClick={() => {
          setItemData({ itemId: '', name: '', price: '', image: '' });
          setEditingItemId(null);
          setDrawerOpen(true);
        }}>
          + Add Item
        </button>
      </div>

      {/* Grid of items */}
      <div className="items-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="item-card">
            <img src={item.image} alt={item.name} className="item-image" />
            <div className="item-info">
              <p className="item-name">{item.name}</p>
              <span className="item-price">RM {item.price.toFixed(2)}</span>
            </div>
            <div className="card-buttons">
              <button className="edit-btn" onClick={() => openDrawer(item)}>✏️ Edit</button>
              <button className="delete-btn" onClick={() => deleteItem(item.id, item.name)}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer for Add/Update */}
      {drawerOpen && (
        <div className="drawer">
          <h3>{editingItemId ? 'Update Item' : 'Add New Item'}</h3>
          <input
            type="text"
            placeholder="Item ID (RFID)"
            value={itemData.itemId}
            onChange={(e) => setItemData({ ...itemData, itemId: e.target.value.toUpperCase() })}
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
            <button className="save-btn" onClick={handleAddOrUpdate}>💾 Save</button>
            <button className="cancel-btn" onClick={() => {
              setDrawerOpen(false);
              setItemData({ itemId: '', name: '', price: '', image: '' });
              setEditingItemId(null);
            }}>❌ Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
