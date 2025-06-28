// App.js
import React, { useState } from 'react';
import Tabs from './Tabs';
import HomeTab from './HomeTab';
import MealPlanTab from './MealPlanTab';
import PantryTab from './PantryTab'; // New component
import GroceryListTab from './GroceryListTab';
import MessageBox from './MessageBox';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState({ title: '', message: '' });
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);
  console.log('Active tab:', activeTab);
 

  // Mock data for recipes
  const mockRecipes = [
    {
      id: 'chicken-alfredo',
      name: 'Chicken Alfredo',
      image: 'https://placehold.co/400x250/A7F3D0/10B981?text=Chicken+Alfredo',
      servings: 4,
      dietary: [],
      ingredients: [
        { item: 'Fettuccine pasta', quantity: 1, unit: 'lb', category: 'Pantry' },
        { item: 'Chicken breasts', quantity: 2, unit: 'large', category: 'Proteins' },
        { item: 'Heavy cream', quantity: 2, unit: 'cups', category: 'Dairy' },
        { item: 'Parmesan cheese', quantity: 1, unit: 'cup', category: 'Dairy' },
        { item: 'Garlic', quantity: 3, unit: 'cloves', category: 'Produce' },
        { item: 'Butter', quantity: 0.5, unit: 'stick', category: 'Dairy' },
        { item: 'Salt', quantity: 1, unit: 'tsp', category: 'Pantry' },
        { item: 'Black pepper', quantity: 0.5, unit: 'tsp', category: 'Pantry' }
      ]
    },
    {
      id: 'lentil-soup',
      name: 'Hearty Lentil Soup',
      image: 'https://placehold.co/400x250/FDE68A/D97706?text=Lentil+Soup',
      servings: 6,
      dietary: ['vegetarian', 'vegan', 'gluten-free'],
      ingredients: [
        { item: 'Brown lentils', quantity: 1.5, unit: 'cups', category: 'Pantry' },
        { item: 'Vegetable broth', quantity: 6, unit: 'cups', category: 'Pantry' },
        { item: 'Carrots', quantity: 2, unit: 'medium', category: 'Produce' },
        { item: 'Celery stalks', quantity: 2, unit: 'medium', category: 'Produce' },
        { item: 'Onion', quantity: 1, unit: 'large', category: 'Produce' },
        { item: 'Canned diced tomatoes', quantity: 1, unit: '14.5oz can', category: 'Pantry' },
        { item: 'Garlic', quantity: 2, unit: 'cloves', category: 'Produce' },
        { item: 'Olive oil', quantity: 2, unit: 'tbsp', category: 'Pantry' },
        { item: 'Cumin', quantity: 1, unit: 'tsp', category: 'Pantry' },
        { item: 'Thyme', quantity: 0.5, unit: 'tsp', category: 'Pantry' },
        { item: 'Salt', quantity: 1, unit: 'tsp', category: 'Pantry' },
        { item: 'Black pepper', quantity: 0.5, unit: 'tsp', category: 'Pantry' }
      ]
    },
    {
      id: 'beef-tacos',
      name: 'Beef Tacos',
      image: 'https://placehold.co/400x250/FEF2F2/EF4444?text=Beef+Tacos',
      servings: 4,
      dietary: [],
      ingredients: [
        { item: 'Ground beef', quantity: 1, unit: 'lb', category: 'Proteins' },
        { item: 'Taco shells', quantity: 12, unit: '', category: 'Pantry' },
        { item: 'Taco seasoning', quantity: 1, unit: 'pack', category: 'Pantry' },
        { item: 'Lettuce', quantity: 1, unit: 'head', category: 'Produce' },
        { item: 'Tomatoes', quantity: 2, unit: 'medium', category: 'Produce' },
        { item: 'Shredded cheddar cheese', quantity: 1, unit: 'cup', category: 'Dairy' },
        { item: 'Sour cream', quantity: 0.5, unit: 'cup', category: 'Dairy' }
      ]
    },
    {
      id: 'mediterranean-quinoa-salad',
      name: 'Mediterranean Quinoa Salad',
      image: 'https://placehold.co/400x250/D1FAE5/065F46?text=Quinoa+Salad',
      servings: 4,
      dietary: ['vegetarian', 'vegan', 'gluten-free'],
      ingredients: [
        { item: 'Quinoa', quantity: 1, unit: 'cup', category: 'Pantry' },
        { item: 'Cucumber', quantity: 1, unit: 'medium', category: 'Produce' },
        { item: 'Cherry tomatoes', quantity: 1, unit: 'pint', category: 'Produce' },
        { item: 'Red onion', quantity: 0.5, unit: 'small', category: 'Produce' },
        { item: 'Kalamata olives', quantity: 0.5, unit: 'cup', category: 'Pantry' },
        { item: 'Fresh parsley', quantity: 0.25, unit: 'cup', category: 'Produce' },
        { item: 'Lemon', quantity: 1, unit: 'medium', category: 'Produce' },
        { item: 'Olive oil', quantity: 0.25, unit: 'cup', category: 'Pantry' },
        { item: 'Feta cheese', quantity: 0.5, unit: 'cup', category: 'Dairy' }
      ]
    }
  ];

   const showMessage = (title, message) => {
    setMessageBoxContent({ title, message });
    setShowMessageBox(true);
  };

  const closeMessage = () => {
    setShowMessageBox(false);
  };

return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="container bg-white rounded-2xl shadow-xl p-8 my-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
          Smart Grocery List Generator
        </h1>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="tab-content-container">
          {activeTab === 'home' && <HomeTab setActiveTab={setActiveTab} />}
          {activeTab === 'meal-plan' && (
            <MealPlanTab 
              mockRecipes={mockRecipes}
              showMessage={showMessage}
              selectedMeals={selectedMeals}
              setSelectedMeals={setSelectedMeals}
            />
          )}
          {activeTab === 'pantry' && (
            <PantryTab
              pantryItems={pantryItems}
              setPantryItems={setPantryItems}
              showMessage={showMessage}
            />
          )}
          {activeTab === 'grocery-list' && (
            <GroceryListTab 
              selectedMeals={selectedMeals}
              pantryItems={pantryItems}
              showMessage={showMessage}
            />
          )}
        </div>

        {/* MessageBox remains the same */}
      </div>
    </div>
  );
}

export default App;
