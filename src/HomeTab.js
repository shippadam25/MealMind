import React from 'react';

const HomeTab = ({ setActiveTab }) => {
  return (
    <div id="home-content" className="tab-content active">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome to Your Smart Grocery Helper!</h2>
      <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
        Plan your meals, manage your pantry, and generate efficient grocery lists, all in one place.
        Reduce food waste and save time on your shopping trips.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <button 
          className="btn-primary" 
          onClick={() => setActiveTab('meal-plan')}
        >
          Start Planning Meals
        </button>
        <button 
          className="btn-secondary" 
          onClick={() => setActiveTab('grocery-list')}
        >
          View Your Grocery List
        </button>
      </div>
    </div>
  );
};

export default HomeTab;