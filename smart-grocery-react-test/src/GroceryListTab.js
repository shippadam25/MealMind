import React, { useState, useEffect } from 'react';

const GroceryListTab = ({
  selectedMeals, // This prop now receives 'mealsForGroceryList' from App.js
  pantryItems,
  showMessage,
  user, // Receive user prop
  db, // Receive db prop
  appId // Receive appId prop
}) => {
  const [categorizedList, setCategorizedList] = useState({});
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([]);

  useEffect(() => {
    // This useEffect will now react to changes in 'mealsForGroceryList'
    if (selectedMeals.length > 0 || pantryItems.length > 0) { // Also react to pantry changes
      generateGroceryList();
    } else {
      setCategorizedList({}); // Clear list if no meals are selected for grocery
      setOptimizationSuggestions([]);
    }
  }, [selectedMeals, pantryItems]); // 'selectedMeals' here refers to the prop passed for grocery list generation

  const normalizeIngredientName = (name) => {
    return name.toLowerCase()
      .replace(/s$/, '')
      .replace(/(\s*(diced|chopped|sliced|fresh|canned|dried|ground))\\s*/g, '');
  };

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const generateGroceryList = () => {
    const combinedIngredients = new Map();
    const missingIngredients = new Set();

    selectedMeals.forEach(({ recipe, servings: desiredServings }) => {
      const scalingFactor = desiredServings / recipe.servings;

      recipe.ingredients.forEach(ingredient => {
        const normalizedItem = normalizeIngredientName(ingredient.item);
        const scaledQuantity = ingredient.quantity * scalingFactor;

        // Check if item is in pantry (normalized)
        if (!pantryItems.some(p => normalizeIngredientName(p.name) === normalizedItem)) {
          missingIngredients.add(normalizedItem);
        }

        if (combinedIngredients.has(normalizedItem)) {
          const existing = combinedIngredients.get(normalizedItem);
          existing.quantity += scaledQuantity;
        } else {
          combinedIngredients.set(normalizedItem, {
            item: ingredient.item,
            quantity: scaledQuantity,
            unit: ingredient.unit,
            category: ingredient.category || 'Miscellaneous'
          });
        }
      });
    });

    const categorized = {};
    combinedIngredients.forEach(ing => {
      // Only add to grocery list if not in pantry
      if (!pantryItems.some(p => normalizeIngredientName(p.name) === normalizeIngredientName(ing.item))) {
        const category = ing.category;
        if (!categorized[category]) {
          categorized[category] = [];
        }
        categorized[category].push(ing);
      }
    });

    setCategorizedList(categorized);
    generateOptimizationSuggestions(categorized, missingIngredients);
  };

  const generateOptimizationSuggestions = (categorizedList, missingIngredients) => {
    const suggestions = [];

    // Suggest using pantry items that might be less common or have specific uses
    const suggestedPantryUses = [
      'Parmesan cheese', 'Canned diced tomatoes', 'Olive oil', 'Garlic'
    ];

    // Check for unused pantry items
    if (pantryItems.length > 0 && selectedMeals.length > 0) {
      const allRecipeIngredients = new Set();
      selectedMeals.forEach(({ recipe }) => {
        recipe.ingredients.forEach(ing => allRecipeIngredients.add(normalizeIngredientName(ing.item)));
      });

      pantryItems.forEach(pantryItem => {
        const normalizedPantryItem = normalizeIngredientName(pantryItem.name);
        if (!allRecipeIngredients.has(normalizedPantryItem)) {
          suggestions.push(`You have ${capitalizeWords(pantryItem.name)} in your pantry that wasn't used in your selected meals. Can you find another use for it?`);
        }
      });
    }

    setOptimizationSuggestions(suggestions);
  };

  const sortedCategories = Object.keys(categorizedList).sort();

  return (
    <div className="tab-content-container overflow-y-auto max-h-[calc(100vh-250px)]">
      <section id="groceryListSection" className="p-6 bg-white rounded-xl shadow-inner">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Your Smart Grocery List</h2>
        <div id="groceryList" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedCategories.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              {selectedMeals.length === 0
                ? 'Select meals on the "Meal Plan" tab to generate your grocery list.'
                : 'All ingredients for your selected meals are already in your pantry!'}
            </p>
          ) : (
            sortedCategories.map(category => (
              <div key={category} className="card p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{category}</h3>
                <ul className="list-disc pl-5 text-gray-700">
                  {categorizedList[category]
                    .sort((a, b) => a.item.localeCompare(b.item))
                    .map((ing, index) => {
                      const displayQuantity = (ing.quantity % 1 === 0) ? ing.quantity : ing.quantity.toFixed(1);
                      return (
                        <li key={index}>
                          {displayQuantity} {ing.unit ? ing.unit + ' ' : ''}{capitalizeWords(ing.item)}
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))
          )}
        </div>

        {optimizationSuggestions.length > 0 && (
          <div id="wasteOptimizationSuggestions" className="mt-10 p-6 bg-yellow-50 rounded-xl shadow-inner">
            <h3 className="text-2xl font-bold text-yellow-800 mb-4">Waste Optimization Suggestions:</h3>
            <ul id="optimizationList" className="list-disc list-inside text-gray-700">
              {optimizationSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default GroceryListTab;
