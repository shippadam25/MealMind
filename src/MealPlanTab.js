import React, { useState, useEffect } from 'react';
import MealCard from './MealCard';

const MealPlanTab = ({ 
  mockRecipes, 
  showMessage,
  selectedMeals,
  setSelectedMeals
}) => {
  const [mealInput, setMealInput] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState({
    vegetarian: false,
    vegan: false,
    'gluten-free': false,
    'dairy-free': false,
    'nut-free': false
  });
  const [mealSuggestions, setMealSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  console.log('MealPlanTab rendering with:', { selectedMeals });

  const normalizeIngredientName = (name) => {
    return name.toLowerCase()
      .replace(/s$/, '')
      .replace(/(\s*(diced|chopped|sliced|fresh|canned|dried|ground))\s*/g, '');
  };

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  useEffect(() => {
    if (mealInput.length > 0) {
      const selectedDiets = Object.keys(dietaryPreferences)
        .filter(diet => dietaryPreferences[diet]);
      
      const filtered = mockRecipes.filter(recipe => {
        const matchesName = recipe.name.toLowerCase().includes(mealInput.toLowerCase());
        const matchesDiet = selectedDiets.every(diet => recipe.dietary.includes(diet));
        const notSelected = !selectedMeals.some(m => m.recipe.id === recipe.id);
        return matchesName && matchesDiet && notSelected;
      });
      
      setMealSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setMealSuggestions([]);
      setShowSuggestions(false);
    }
  }, [mealInput, dietaryPreferences, selectedMeals]);

  const addMealToSelection = (recipe) => {
    if (selectedMeals.some(m => m.recipe.id === recipe.id)) {
      showMessage('Already Added', `${recipe.name} is already in your meal plan.`);
      return;
    }

    setSelectedMeals([...selectedMeals, { recipe, servings: recipe.servings || 4 }]);
    setMealInput('');
    setShowSuggestions(false);
  };

  const removeMeal = (id) => {
    setSelectedMeals(selectedMeals.filter(m => m.recipe.id !== id));
  };

  const updateServings = (id, servings) => {
    setSelectedMeals(selectedMeals.map(m => 
      m.recipe.id === id ? { ...m, servings } : m
    ));
  };

  const handleDietaryChange = (diet) => {
    setDietaryPreferences({
      ...dietaryPreferences,
      [diet]: !dietaryPreferences[diet]
    });
  };

  return (
    <div className="tab-content-container">
      <section className="p-6 bg-blue-50 rounded-xl shadow-inner">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Your Meal Plan</h2>

        <div className="mb-6">
          <label htmlFor="mealInput" className="block text-lg font-medium text-gray-700 mb-2">
            Search and Add Meals:
          </label>
          <div className="relative">
            <input
              type="text"
              id="mealInput"
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              onFocus={() => setShowSuggestions(mealSuggestions.length > 0)}
              placeholder="e.g., Chicken Alfredo, Lentil Soup"
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              id="addMealBtn"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-blue-600 hover:text-blue-800"
              onClick={() => {
                const recipe = mockRecipes.find(r => 
                  r.name.toLowerCase() === mealInput.toLowerCase()
                );
                if (recipe) {
                  addMealToSelection(recipe);
                } else if (mealInput) {
                  showMessage('Meal Not Found', `"${capitalizeWords(mealInput)}" was not found in our recipe list.`);
                }
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
            {showSuggestions && (
              <div id="mealSuggestions" className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                {mealSuggestions.map(recipe => (
                  <div
                    key={recipe.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer rounded-md flex items-center"
                    onClick={() => addMealToSelection(recipe)}
                  >
                    <img src={recipe.image} alt={recipe.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                    <span className="font-medium text-gray-800">{recipe.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div id="selectedMealsContainer" className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedMeals.length === 0 ? (
              <p className="text-gray-500 text-center col-span-full">No meals added yet. Search and add meals above.</p>
            ) : (
              selectedMeals.map(({ recipe, servings }) => (
                <MealCard
                  key={recipe.id}
                  recipe={recipe}
                  servings={servings}
                  onRemove={removeMeal}
                  onServingsChange={updateServings}
                />
              ))
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Dietary Preferences:</label>
          <div id="dietaryPreferences" className="flex flex-wrap gap-4">
            {Object.keys(dietaryPreferences).map(diet => (
              <label key={diet} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={dietaryPreferences[diet]}
                  onChange={() => handleDietaryChange(diet)}
                  className="checkbox-input"
                />
                {capitalizeWords(diet)}
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MealPlanTab;