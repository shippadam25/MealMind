import React, { useState, useEffect } from 'react';
import MealCard from './MealCard';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions

const MealPlanTab = ({
  mockRecipes,
  showMessage,
  selectedMeals,
  setSelectedMeals,
  mealsForGroceryList = [],
  setMealsForGroceryList,
  user, // Receive user prop
  db, // Receive db prop
  appId // Receive appId prop
}) => {
  const [ingredientInput, setIngredientInput] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState({
    vegetarian: false,
    vegan: false,
    'gluten-free': false,
    'dairy-free': false,
    'nut-free': false
  });
  const [matchingRecipes, setMatchingRecipes] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedRecipeForDetails, setSelectedRecipeForDetails] = useState(null);

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
    if (ingredientInput.length > 0) {
      const selectedDiets = Object.keys(dietaryPreferences)
        .filter(diet => dietaryPreferences[diet]);

      const filtered = mockRecipes.filter(recipe => {
        const matchesIngredient = recipe.ingredients.some(ing =>
          normalizeIngredientName(ing.item).includes(normalizeIngredientName(ingredientInput))
        );
        const matchesDiet = selectedDiets.every(diet => recipe.dietary.includes(diet));
        return matchesIngredient && matchesDiet;
      });

      setMatchingRecipes(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setMatchingRecipes([]);
      setShowSuggestions(false);
    }
  }, [ingredientInput, dietaryPreferences]);

  // Function to save mealsForGroceryList to Firestore
  const saveMealsForGroceryListToFirestore = async (updatedMeals) => {
    if (user && db && appId) { // Ensure appId is available
      const docRef = doc(db, `artifacts/${appId}/users/${user.uid}/groceryList`, 'userGroceryList');
      try {
        await setDoc(docRef, { meals: updatedMeals });
        console.log("Grocery list meals updated in Firestore from MealPlanTab.");
      } catch (error) {
        console.error("Error saving grocery list meals from MealPlanTab:", error);
        showMessage("Save Error", `Failed to save grocery list meals: ${error.message}`);
      }
    }
  };

  const addMealToGroceryList = (recipe) => {
    if (mealsForGroceryList.some(m => m.recipe.id === recipe.id)) {
      showMessage('Already in Grocery List', `${recipe.name} is already marked for your grocery list.`);
      return;
    }

    const newMealsForGroceryList = [...mealsForGroceryList, { recipe, servings: recipe.servings || 4 }];
    setMealsForGroceryList(newMealsForGroceryList);
    saveMealsForGroceryListToFirestore(newMealsForGroceryList); // Save to Firestore
    showMessage('Added to Grocery List', `${recipe.name} has been added to your grocery list!`);
    setIngredientInput('');
    setSelectedRecipeForDetails(null);
    setShowSuggestions(false);
  };

  // Function to save selectedMeals (meal plan) to Firestore
  const saveSelectedMealsToFirestore = async (updatedMeals) => {
    if (user && db && appId) { // Ensure appId is available
      const docRef = doc(db, `artifacts/${appId}/users/${user.uid}/mealPlan`, 'userMealPlan');
      try {
        await setDoc(docRef, { meals: updatedMeals });
        console.log("Meal plan updated in Firestore from MealPlanTab.");
      } catch (error) {
        console.error("Error saving meal plan from MealPlanTab:", error);
        showMessage("Save Error", `Failed to save meal plan: ${error.message}`);
      }
    }
  };

  const removeMeal = (id) => {
    const newSelectedMeals = selectedMeals.filter(m => m.recipe.id !== id);
    setSelectedMeals(newSelectedMeals);
    saveSelectedMealsToFirestore(newSelectedMeals); // Save to Firestore
  };

  const updateServings = (id, servings) => {
    const newSelectedMeals = selectedMeals.map(m =>
      m.recipe.id === id ? { ...m, servings } : m
    );
    setSelectedMeals(newSelectedMeals);
    saveSelectedMealsToFirestore(newSelectedMeals); // Save to Firestore
  };

  const handleDietaryChange = (diet) => {
    setDietaryPreferences({
      ...dietaryPreferences,
      [diet]: !dietaryPreferences[diet]
    });
  };

  const viewRecipeDetails = (recipe) => {
    setSelectedRecipeForDetails(recipe);
    setShowSuggestions(false);
  };

  return (
    <div className="tab-content-container overflow-y-auto max-h-[calc(100vh-250px)]">
      <section className="p-6 bg-blue-50 rounded-xl shadow-inner">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Your Meal Plan</h2>

        <div className="mb-6">
          <label htmlFor="ingredientInput" className="block text-lg font-medium text-gray-700 mb-2">
            Search Meals by Ingredient:
          </label>
          <div className="relative">
            <input
              type="text"
              id="ingredientInput"
              value={ingredientInput}
              onChange={(e) => {
                setIngredientInput(e.target.value);
                setSelectedRecipeForDetails(null);
              }}
              onFocus={() => setShowSuggestions(matchingRecipes.length > 0)}
              placeholder="e.g., chicken, lentils, quinoa"
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />

            {showSuggestions && (
              <div id="mealSuggestions" className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                {matchingRecipes.map(recipe => (
                  <div
                    key={recipe.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer rounded-md flex items-center"
                    onClick={() => viewRecipeDetails(recipe)}
                  >
                    <img src={recipe.image} alt={recipe.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                    <span className="font-medium text-gray-800">{recipe.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedRecipeForDetails && (
            <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="text-xl font-bold text-blue-700 mb-3">{selectedRecipeForDetails.name}</h3>
              <img src={selectedRecipeForDetails.image} alt={selectedRecipeForDetails.name} className="w-full h-48 object-cover rounded-md mb-4"/>
              <p className="text-gray-700 mb-2">Servings: {selectedRecipeForDetails.servings}</p>
              {selectedRecipeForDetails.dietary.length > 0 && (
                <p className="text-gray-700 mb-2">Dietary: {selectedRecipeForDetails.dietary.map(capitalizeWords).join(', ')}</p>
              )}
              <h4 className="font-semibold text-gray-800 mt-4 mb-2">Ingredients:</h4>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                {selectedRecipeForDetails.ingredients.map((ing, index) => (
                  <li key={index}>{ing.quantity} {ing.unit} {ing.item}</li>
                ))}
              </ul>
              <button
                onClick={() => addMealToGroceryList(selectedRecipeForDetails)}
                className="btn-primary bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Add to Grocery List
              </button>
              <button
                onClick={() => setSelectedRecipeForDetails(null)}
                className="ml-4 text-blue-600 hover:text-blue-800 py-2 px-4 rounded-lg"
              >
                Back to Search
              </button>
            </div>
          )}

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
