import React, { useState } from 'react';
import './ShoppingList.css';

const ShoppingList = () => {
  // In a real app, this would be fetched from local storage or a database
  const [items, setItems] = useState([
    { id: 1, name: 'Chicken breast', amount: '2', unit: 'pounds', checked: false },
    { id: 2, name: 'Yogurt', amount: '1', unit: 'cup', checked: false },
    { id: 3, name: 'Garam masala', amount: '2', unit: 'tablespoons', checked: false },
    { id: 4, name: 'Tomato sauce', amount: '15', unit: 'ounces', checked: false },
    { id: 5, name: 'Heavy cream', amount: '1', unit: 'cup', checked: false },
    { id: 6, name: 'Spaghetti', amount: '1', unit: 'pound', checked: true },
    { id: 7, name: 'Parmesan cheese', amount: '1', unit: 'cup', checked: true },
  ]);

  const [newItem, setNewItem] = useState({ name: '', amount: '', unit: '' });

  const handleItemChange = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    console.log('Shopping list input change:', name, value); // Debug log
    setNewItem({
      ...newItem,
      [name]: value,
    });
  };

  const addItem = (e) => {
    e.preventDefault();
    console.log('Adding item:', newItem); // Debug log
    if (newItem.name.trim() === '') return;
    
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    
    setItems([
      ...items,
      {
        id: newId,
        name: newItem.name.trim(),
        amount: newItem.amount.trim(),
        unit: newItem.unit.trim(),
        checked: false,
      },
    ]);
    
    setNewItem({ name: '', amount: '', unit: '' });
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearCheckedItems = () => {
    setItems(items.filter(item => !item.checked));
  };

  const clearAllItems = () => {
    setItems([]);
  };

  // Group items by checked status
  const uncheckedItems = items.filter(item => !item.checked);
  const checkedItems = items.filter(item => item.checked);

  return (
    <div className="shopping-list-page">
      <div className="page-header">
        <h1>Shopping List</h1>
        <p>Keep track of ingredients you need to buy</p>
      </div>

      <div className="shopping-list-container">
        <div className="add-item-form">
          <form onSubmit={addItem}>
            <div className="form-row">
              <input
                type="text"
                name="amount"
                value={newItem.amount}
                onChange={handleNewItemChange}
                placeholder="Amount"
                className="amount-input"
              />
              <input
                type="text"
                name="unit"
                value={newItem.unit}
                onChange={handleNewItemChange}
                placeholder="Unit"
                className="unit-input"
              />
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleNewItemChange}
                placeholder="Item name"
                className="name-input"
                required
              />
              <button type="submit" className="add-btn">
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </form>
        </div>

        <div className="list-actions">
          <button 
            className="btn btn-secondary" 
            onClick={clearCheckedItems}
            disabled={checkedItems.length === 0}
          >
            <i className="fas fa-trash"></i> Clear Checked Items
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={clearAllItems}
            disabled={items.length === 0}
          >
            <i className="fas fa-trash-alt"></i> Clear All
          </button>
        </div>

        <div className="shopping-list">
          {uncheckedItems.length > 0 ? (
            <ul className="items-list">
              {uncheckedItems.map((item) => (
                <li key={item.id} className="list-item">
                  <div className="item-check">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleItemChange(item.id)}
                      id={`item-${item.id}`}
                    />
                    <label htmlFor={`item-${item.id}`}></label>
                  </div>
                  <div className="item-details">
                    <span className="item-amount">{item.amount} {item.unit}</span>
                    <span className="item-name">{item.name}</span>
                  </div>
                  <button 
                    className="remove-btn" 
                    onClick={() => removeItem(item.id)}
                    title="Remove item"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-list-message">
              <p>Your shopping list is empty. Add some items!</p>
            </div>
          )}

          {checkedItems.length > 0 && (
            <div className="checked-items">
              <h3>Checked Items</h3>
              <ul className="items-list">
                {checkedItems.map((item) => (
                  <li key={item.id} className="list-item checked">
                    <div className="item-check">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleItemChange(item.id)}
                        id={`item-${item.id}`}
                      />
                      <label htmlFor={`item-${item.id}`}></label>
                    </div>
                    <div className="item-details">
                      <span className="item-amount">{item.amount} {item.unit}</span>
                      <span className="item-name">{item.name}</span>
                    </div>
                    <button 
                      className="remove-btn" 
                      onClick={() => removeItem(item.id)}
                      title="Remove item"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;