/* global __app_id */ // Inform ESLint that __app_id is a global variable

// App.js
import React, { useState, useEffect } from 'react';
import Tabs from './Tabs';
import HomeTab from './HomeTab';
import MealPlanTab from './MealPlanTab';
import PantryTab from './PantryTab';
import GroceryListTab from './GroceryListTab';
import MessageBox from './MessageBox';
import LoginPage from './LoginPage';
import './App.css';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSnanC2KDMVlAQuBINA1x5YxwFBV1kEAE",
  authDomain: "meal-mind-2d0dc.firebaseapp.com",
  projectId: "meal-mind-2d0dc",
  storageBucket: "meal-mind-2d0dc.firebasestorage.app",
  messagingSenderId: "531768955246",
  appId: "1:531768955246:web:258e664172d5441114b17f"
};

// Initialize Firebase app outside of the component to avoid re-initialization
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState({ title: '', message: '' });

  // States for data
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [mealsForGroceryList, setMealsForGroceryList] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);

  // Firebase states
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false); // Indicates if Firebase auth state has been checked

  // Define appId here, with a fallback for local development if __app_id is not provided
  const currentAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  // Moved showMessage and closeMessage definitions here to ensure they are initialized
  // before being referenced in useEffects or other functions.
  const showMessage = (title, message) => {
    setMessageBoxContent({ title, message });
    setShowMessageBox(true);
  };

  const closeMessage = () => {
    setShowMessageBox(false);
  };

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log('User signed in:', currentUser.uid);
      } else {
        setUser(null);
        console.log('User signed out.');
        // Clear data when user logs out
        setSelectedMeals([]);
        setMealsForGroceryList([]);
        setPantryItems([]);
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Firestore Data Loading (Meal Plan and Grocery List Meals)
  useEffect(() => {
    let unsubscribeMealPlan = () => {};
    let unsubscribeGroceryList = () => {};

    if (user && db) {
      // Use currentAppId defined above
      const mealPlanDocRef = doc(db, `artifacts/${currentAppId}/users/${user.uid}/mealPlan`, 'userMealPlan');
      const groceryListDocRef = doc(db, `artifacts/${currentAppId}/users/${user.uid}/groceryList`, 'userGroceryList');

      // Listen for meal plan changes
      unsubscribeMealPlan = onSnapshot(mealPlanDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSelectedMeals(data.meals || []);
          console.log("Loaded meal plan from Firestore:", data.meals);
        } else {
          setSelectedMeals([]);
          console.log("No meal plan found in Firestore, initializing empty.");
        }
      }, (error) => {
        console.error("Error fetching meal plan:", error);
        showMessage("Data Load Error", `Failed to load meal plan: ${error.message}`);
      });

      // Listen for grocery list meals changes
      unsubscribeGroceryList = onSnapshot(groceryListDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMealsForGroceryList(data.meals || []);
          console.log("Loaded grocery list meals from Firestore:", data.meals);
        } else {
          setMealsForGroceryList([]);
          console.log("No grocery list meals found in Firestore, initializing empty.");
        }
      }, (error) => {
        console.error("Error fetching grocery list meals:", error);
        showMessage("Data Load Error", `Failed to load grocery list meals: ${error.message}`);
      });
    }

    return () => {
      unsubscribeMealPlan();
      unsubscribeGroceryList();
    };
  }, [user, db, currentAppId, showMessage]); // Add showMessage to dependencies

  // Firestore Data Loading (Pantry Items)
  useEffect(() => {
    let unsubscribePantry = () => {};

    if (user && db) {
      // Use currentAppId defined above
      const pantryDocRef = doc(db, `artifacts/${currentAppId}/users/${user.uid}/pantry`, 'userPantry');

      // Listen for pantry items changes
      unsubscribePantry = onSnapshot(pantryDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPantryItems(data.items || []);
          console.log("Loaded pantry items from Firestore:", data.items);
        } else {
          setPantryItems([]);
          console.log("No pantry items found in Firestore, initializing empty.");
        }
      }, (error) => {
        console.error("Error fetching pantry items:", error);
        showMessage("Data Load Error", `Failed to load pantry items: ${error.message}`);
      });
    }

    return () => unsubscribePantry();
  }, [user, db, setPantryItems, showMessage, currentAppId]); // Add showMessage to dependencies


  // Firestore Data Saving (Meal Plan)
  useEffect(() => {
    if (authReady && user && db) {
      // Use currentAppId defined above
      const mealPlanDocRef = doc(db, `artifacts/${currentAppId}/users/${user.uid}/mealPlan`, 'userMealPlan');
      setDoc(mealPlanDocRef, { meals: selectedMeals })
        .then(() => console.log("Meal plan saved to Firestore."))
        .catch(error => {
          console.error("Error saving meal plan:", error);
          showMessage("Save Error", `Failed to save meal plan: ${error.message}`);
        });
    }
  }, [selectedMeals, authReady, user, db, currentAppId, showMessage]); // Add showMessage to dependencies

  // Firestore Data Saving (Grocery List Meals)
  useEffect(() => {
    if (authReady && user && db) {
      // Use currentAppId defined above
      const groceryListDocRef = doc(db, `artifacts/${currentAppId}/users/${user.uid}/groceryList`, 'userGroceryList');
      setDoc(groceryListDocRef, { meals: mealsForGroceryList })
        .then(() => console.log("Grocery list meals saved to Firestore."))
        .catch(error => {
          console.error("Error saving grocery list meals:", error);
          showMessage("Save Error", `Failed to save grocery list meals: ${error.message}`);
        });
    }
  }, [mealsForGroceryList, authReady, user, db, currentAppId, showMessage]); // Add showMessage to dependencies

  // Firestore Data Saving (Pantry Items)
  useEffect(() => {
    if (authReady && user && db) {
      // Use currentAppId defined above
      const pantryDocRef = doc(db, `artifacts/${currentAppId}/users/${user.uid}/pantry`, 'userPantry');
      setDoc(pantryDocRef, { items: pantryItems })
        .then(() => console.log("Pantry items saved to Firestore."))
        .catch(error => {
          console.error("Error saving pantry items:", error);
          showMessage("Save Error", `Failed to save pantry items: ${error.message}`);
        });
    }
  }, [pantryItems, authReady, user, db, currentAppId, showMessage]); // Add showMessage to dependencies


  // Mock data for recipes (remains the same)
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

  const handleLoginSuccess = () => {
    showMessage('Login Success', 'You have successfully logged in!');
    setActiveTab('home');
  };

  const handleLogout = async () => {
    try {
      if (auth) { // Use the globally defined auth instance
        await signOut(auth);
        showMessage('Logged Out', 'You have been successfully logged out.');
        setActiveTab('home');
      }
    } catch (error) {
      console.error('Logout error:', error);
      showMessage('Logout Failed', `Error logging out: ${error.message}`);
    }
  };

  // Render LoginPage if not authenticated
  if (!authReady || !user) {
    return (
      <LoginPage
        showMessage={showMessage}
        onLoginSuccess={handleLoginSuccess}
        setActiveTab={setActiveTab}
        authReady={authReady}
        firebaseAuth={auth} // Pass the globally defined auth instance
      />
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 flex flex-col">
      <div className="container bg-white rounded-2xl shadow-xl p-8 my-8 flex flex-col flex-grow">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
          Smart Grocery List Generator
        </h1>

        {user && user.uid && (
          <div className="text-center text-gray-600 mb-4">
            Logged in as: <span className="font-semibold">{user.email || user.uid}</span>
            <button
              onClick={handleLogout}
              className="ml-4 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        )}

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="tab-content-container flex-grow">
          {activeTab === 'home' && <HomeTab setActiveTab={setActiveTab} />}
          {activeTab === 'meal-plan' && (
            <MealPlanTab
              mockRecipes={mockRecipes}
              showMessage={showMessage}
              selectedMeals={selectedMeals}
              setSelectedMeals={setSelectedMeals}
              mealsForGroceryList={mealsForGroceryList}
              setMealsForGroceryList={setMealsForGroceryList}
              user={user}
              db={db}
              appId={currentAppId}
            />
          )}
          {activeTab === 'pantry' && (
            <PantryTab
              pantryItems={pantryItems}
              setPantryItems={setPantryItems}
              showMessage={showMessage}
              user={user}
              db={db}
              appId={currentAppId}
            />
          )}
          {activeTab === 'grocery-list' && (
            <GroceryListTab
              selectedMeals={mealsForGroceryList}
              pantryItems={pantryItems}
              showMessage={showMessage}
              user={user}
              db={db}
              appId={currentAppId}
            />
          )}
        </div>

        {showMessageBox && (
          <MessageBox
            title={messageBoxContent.title}
            message={messageBoxContent.message}
            onClose={closeMessage}
          />
        )}
      </div>
    </div>
  );
}

export default App;
