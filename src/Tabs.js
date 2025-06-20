// Tabs.js
import React from 'react';

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="tab-nav">
      <ul className="flex justify-center w-full">
        <li>
          <button 
            className={`tab-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
        </li>
        <li>
          <button 
            className={`tab-button ${activeTab === 'meal-plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('meal-plan')}
          >
            Meal Plan
          </button>
        </li>
        <li>
          <button 
            className={`tab-button ${activeTab === 'pantry' ? 'active' : ''}`}
            onClick={() => setActiveTab('pantry')}
          >
            Pantry
          </button>
        </li>
        <li>
          <button 
            className={`tab-button ${activeTab === 'grocery-list' ? 'active' : ''}`}
            onClick={() => setActiveTab('grocery-list')}
          >
            Grocery List
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Tabs;