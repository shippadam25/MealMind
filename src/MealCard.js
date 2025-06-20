import React, { useState } from 'react';

const MealCard = ({ recipe, servings, onRemove, onServingsChange }) => {
  const [currentServings, setCurrentServings] = useState(servings);

  const handleServingsChange = (e) => {
    const newServings = parseInt(e.target.value, 10);
    if (!isNaN(newServings) && newServings > 0) {
      setCurrentServings(newServings);
      onServingsChange(recipe.id, newServings);
    }
  };

  return (
    <div className="card flex flex-col items-center p-4 relative">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
        onClick={() => onRemove(recipe.id)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <img src={recipe.image} alt={recipe.name} className="meal-card-image" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{recipe.name}</h3>
      <div className="flex items-center mt-2">
        <label htmlFor={`servings-${recipe.id}`} className="text-gray-700 mr-2">Servings:</label>
        <input
          type="number"
          id={`servings-${recipe.id}`}
          value={currentServings}
          min="1"
          onChange={handleServingsChange}
          className="w-20 p-2 border border-gray-300 rounded-lg text-center text-sm"
        />
      </div>
    </div>
  );
};

export default MealCard;