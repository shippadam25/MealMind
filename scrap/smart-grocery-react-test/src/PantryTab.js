import React, { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore'; // Import Firestore functions

const PantryTab = ({
  pantryItems,
  setPantryItems,
  showMessage,
  user, // Receive user prop
  db, // Receive db prop
  appId // Receive appId prop
}) => {
  const [newItem, setNewItem] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Produce'); // Default category

  // Load pantry items from Firestore when user changes or component mounts
  useEffect(() => {
    let unsubscribe = () => {};

    if (user && db && appId) { // Ensure appId is available
      const pantryDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/pantry`, 'userPantry');

      unsubscribe = onSnapshot(pantryDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPantryItems(data.items || []);
          console.log("Pantry items loaded from Firestore:", data.items);
        } else {
          setPantryItems([]);
          console.log("No pantry items found in Firestore, initializing empty.");
        }
      }, (error) => {
        console.error("Error fetching pantry items:", error);
        showMessage("Data Load Error", `Failed to load pantry items: ${error.message}`);
      });
    }

    return () => unsubscribe(); // Cleanup listener
  }, [user, db, setPantryItems, showMessage, appId]); // Add appId to dependencies

  // Function to save pantry items to Firestore
  const savePantryItemsToFirestore = async (updatedItems) => {
    if (user && db && appId) { // Ensure appId is available
      const docRef = doc(db, `artifacts/${appId}/users/${user.uid}/pantry`, 'userPantry');
      try {
        await setDoc(docRef, { items: updatedItems });
        console.log("Pantry items saved to Firestore.");
      } catch (error) {
        console.error("Error saving pantry items:", error);
        showMessage("Save Error", `Failed to save pantry items: ${error.message}`);
      }
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      const updatedPantry = [...pantryItems, { name: newItem.trim(), category: newItemCategory }];
      setPantryItems(updatedPantry);
      savePantryItemsToFirestore(updatedPantry); // Save to Firestore
      setNewItem('');
      showMessage('Success', `${newItem.trim()} added to pantry!`);
    } else {
      showMessage('Error', 'Pantry item cannot be empty.');
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    const updatedPantry = pantryItems.filter(item => item.name !== itemToRemove.name);
    setPantryItems(updatedPantry);
    savePantryItemsToFirestore(updatedPantry); // Save to Firestore
    showMessage('Removed', `${itemToRemove.name} removed from pantry.`);
  };

  const categories = [
    'Produce', 'Dairy', 'Proteins', 'Grains', 'Spices', 'Canned Goods', 'Frozen', 'Miscellaneous'
  ];

  const categorizedPantry = pantryItems.reduce((acc, item) => {
    const category = item.category || 'Miscellaneous';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item.name);
    return acc;
  }, {});

  const sortedCategories = Object.keys(categorizedPantry).sort();

  return (
    <div className="tab-content-container overflow-y-auto max-h-[calc(100vh-250px)]">
      <section className="p-6 bg-green-50 rounded-xl shadow-inner">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Your Pantry</h2>

        <form onSubmit={handleAddItem} className="mb-8 p-4 bg-green-100 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow">
              <label htmlFor="newItem" className="block text-lg font-medium text-gray-700 mb-2">
                Add New Pantry Item:
              </label>
              <input
                type="text"
                id="newItem"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="e.g., olive oil, flour"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="flex-grow">
              <label htmlFor="newItemCategory" className="block text-lg font-medium text-gray-700 mb-2">
                Category:
              </label>
              <select
                id="newItemCategory"
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary bg-green-600 hover:bg-green-700 px-6 py-3">
              Add Item
            </button>
          </div>
        </form>

        <div id="pantryList" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCategories.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">Your pantry is empty. Add some items above!</p>
          ) : (
            sortedCategories.map(category => (
              <div key={category} className="card p-6 bg-white">
                <h3 className="text-xl font-bold text-green-800 mb-4 border-b pb-2">{category}</h3>
                <ul className="list-disc pl-5 text-gray-700">
                  {categorizedPantry[category].sort().map((item, index) => (
                    <li key={index} className="flex justify-between items-center mb-2">
                      <span>{item}</span>
                      <button
                        onClick={() => handleRemoveItem({ name: item, category: category })}
                        className="text-red-500 hover:text-red-700 text-sm ml-2"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PantryTab;
