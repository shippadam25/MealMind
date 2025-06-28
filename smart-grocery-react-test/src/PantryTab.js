// PantryTab.js
import React, { useState } from 'react';

const PantryTab = ({ pantryItems, setPantryItems, showMessage }) => {
  const [pantryInput, setPantryInput] = useState('');

  const normalizeIngredientName = (name) => {
    return name.toLowerCase()
      .replace(/s$/, '')
      .replace(/(\s*(diced|chopped|sliced|fresh|canned|dried|ground))\s*/g, '');
  };

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const addPantryItem = () => {
    const itemText = pantryInput.trim();
    if (itemText) {
      const normalizedItem = normalizeIngredientName(itemText);
      if (!pantryItems.includes(normalizedItem)) {
        setPantryItems([...pantryItems, normalizedItem]);
      } else {
        showMessage('Already in Pantry', `${capitalizeWords(itemText)} is already in your pantry.`);
      }
      setPantryInput('');
    }
  };

  const removePantryItem = (item) => {
    setPantryItems(pantryItems.filter(i => i !== item));
  };

  return (
    <div className="tab-content-container">
      <section className="p-6 bg-green-50 rounded-xl shadow-inner">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Your Pantry</h2>

        <div className="mb-6">
          <label htmlFor="pantryInput" className="block text-lg font-medium text-gray-700 mb-2">
            Add Items to Your Pantry:
          </label>
          <div className="flex">
            <input
              type="text"
              id="pantryInput"
              value={pantryInput}
              onChange={(e) => setPantryInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPantryItem()}
              placeholder="e.g., eggs, milk, pasta"
              className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:ring-green-500 focus:border-green-500"
            />
            <button
              id="addPantryItemBtn"
              className="btn-primary rounded-l-none bg-green-600 hover:bg-green-700"
              onClick={addPantryItem}
            >
              Add
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Current Pantry Items:</h3>
          <div id="pantryList" className="flex flex-wrap gap-2">
            {pantryItems.length === 0 ? (
              <p className="text-gray-500">Your pantry is empty. Add some ingredients!</p>
            ) : (
              pantryItems.map(item => (
                <span key={item} className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                  {capitalizeWords(item)}
                  <button
                    className="ml-2 text-green-600 hover:text-green-900"
                    onClick={() => removePantryItem(item)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PantryTab;