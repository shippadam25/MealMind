// Your existing JavaScript code...
        // (Copy the entire script block from the previous response here)

        // Mock data for recipes - In a real app, this would come from an API
        const mockRecipes = [
            {
                id: 'chicken-alfredo',
                name: 'Chicken Alfredo',
                image: 'https://placehold.co/400x250/A7F3D0/10B981?text=Chicken+Alfredo', // Tailwind green placeholder
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
                image: 'https://placehold.co/400x250/FDE68A/D97706?text=Lentil+Soup', // Tailwind yellow placeholder
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
                image: 'https://placehold.co/400x250/FEF2F2/EF4444?text=Beef+Tacos', // Tailwind red placeholder
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
                image: 'https://placehold.co/400x250/D1FAE5/065F46?text=Quinoa+Salad', // Tailwind emerald placeholder
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

        // Global state variables
        const selectedMeals = new Map(); // Stores { recipeId: { recipe: {}, servings: N } }
        const pantryItems = new Set(); // Stores unique string items in pantry

        // DOM Elements
        const mealInput = document.getElementById('mealInput');
        const addMealBtn = document.getElementById('addMealBtn');
        const mealSuggestionsDiv = document.getElementById('mealSuggestions');
        const selectedMealsContainer = document.getElementById('selectedMealsContainer');
        const dietaryCheckboxes = document.querySelectorAll('#dietaryPreferences input[type="checkbox"]');
        const pantryInput = document.getElementById('pantryInput');
        const addPantryItemBtn = document.getElementById('addPantryItemBtn');
        const pantryListDiv = document.getElementById('pantryList');
        const generateListBtn = document.getElementById('generateListBtn');
        const groceryListSection = document.getElementById('groceryListSection');
        const groceryListDiv = document.getElementById('groceryList');
        const wasteOptimizationSuggestions = document.getElementById('wasteOptimizationSuggestions');
        const optimizationList = document.getElementById('optimizationList');

        const messageBox = document.getElementById('messageBox');
        const messageBoxTitle = document.getElementById('messageBoxTitle');
        const messageBoxContent = document.getElementById('messageBoxContent');
        const messageBoxCloseBtn = document.getElementById('messageBoxCloseBtn');

        // --- Utility Functions ---

        /**
         * Displays a custom message box.
         * @param {string} title - The title of the message.
         * @param {string} content - The content of the message.
         */
        function showMessageBox(title, content) {
            messageBoxTitle.textContent = title;
            messageBoxContent.textContent = content;
            messageBox.classList.remove('hidden');
        }

        /**
         * Closes the custom message box.
         */
        function closeMessageBox() {
            messageBox.classList.add('hidden');
        }

        /**
         * Normalizes an ingredient name for better matching.
         * Converts to lowercase and removes plural 's' or common suffixes.
         * @param {string} name
         * @returns {string}
         */
        function normalizeIngredientName(name) {
            return name.toLowerCase()
                       .replace(/s$/, '') // Remove plural 's'
                       .replace(/(\s*(diced|chopped|sliced|fresh|canned|dried|ground))\s*/g, ''); // Remove descriptors
        }

        /**
         * Capitalizes the first letter of each word in a string.
         * @param {string} str
         * @returns {string}
         */
        function capitalizeWords(str) {
            return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }


        // --- Meal Selection Logic ---

        /**
         * Renders meal suggestions based on input and filters.
         */
        function renderMealSuggestions() {
            const query = mealInput.value.toLowerCase();
            const selectedDiets = Array.from(dietaryCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            // Filter recipes by query and dietary preferences
            const filteredRecipes = mockRecipes.filter(recipe => {
                const matchesName = recipe.name.toLowerCase().includes(query);
                const matchesDiet = selectedDiets.every(diet => recipe.dietary.includes(diet));
                return matchesName && matchesDiet;
            });

            mealSuggestionsDiv.innerHTML = '';
            if (query.length > 0 && filteredRecipes.length > 0) {
                filteredRecipes.forEach(recipe => {
                    // Don't show suggestions for already added meals
                    if (!selectedMeals.has(recipe.id)) {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.className = 'p-3 hover:bg-blue-50 cursor-pointer rounded-md flex items-center';
                        suggestionItem.innerHTML = `
                            <img src="${recipe.image}" alt="${recipe.name}" class="w-10 h-10 rounded-full mr-3 object-cover">
                            <span class="font-medium text-gray-800">${recipe.name}</span>
                        `;
                        suggestionItem.onclick = () => {
                            addMealToSelection(recipe);
                            mealInput.value = '';
                            mealSuggestionsDiv.classList.add('hidden');
                        };
                        mealSuggestionsDiv.appendChild(suggestionItem);
                    }
                });
                mealSuggestionsDiv.classList.remove('hidden');
            } else {
                mealSuggestionsDiv.classList.add('hidden');
            }
        }

        /**
         * Adds a meal to the selected meals section.
         * @param {Object} recipe - The recipe object to add.
         */
        function addMealToSelection(recipe) {
            if (selectedMeals.has(recipe.id)) {
                showMessageBox('Already Added', `${recipe.name} is already in your meal plan.`);
                return;
            }

            const servings = recipe.servings || 4; // Default to 4 servings
            selectedMeals.set(recipe.id, { recipe, servings });
            renderSelectedMeals();
        }

        /**
         * Renders all currently selected meals in the UI.
         */
        function renderSelectedMeals() {
            selectedMealsContainer.innerHTML = '';
            if (selectedMeals.size === 0) {
                selectedMealsContainer.innerHTML = '<p class="text-gray-500 text-center col-span-full">No meals added yet.</p>';
                return;
            }

            selectedMeals.forEach(({ recipe, servings }) => {
                const mealCard = document.createElement('div');
                mealCard.className = 'card flex flex-col items-center p-4 relative';
                mealCard.innerHTML = `
                    <button class="absolute top-2 right-2 text-gray-400 hover:text-red-600" data-id="${recipe.id}">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <img src="${recipe.image}" alt="${recipe.name}" class="meal-card-image">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2 text-center">${recipe.name}</h3>
                    <div class="flex items-center mt-2">
                        <label for="servings-${recipe.id}" class="text-gray-700 mr-2">Servings:</label>
                        <input type="number" id="servings-${recipe.id}" value="${servings}" min="1"
                               class="w-20 p-2 border border-gray-300 rounded-lg text-center text-sm"
                               data-id="${recipe.id}">
                    </div>
                `;
                selectedMealsContainer.appendChild(mealCard);

                // Add event listener for removing meal
                mealCard.querySelector('button[data-id]').addEventListener('click', (e) => {
                    const idToRemove = e.currentTarget.dataset.id;
                    selectedMeals.delete(idToRemove);
                    renderSelectedMeals();
                });

                // Add event listener for servings change
                mealCard.querySelector(`input[data-id="${recipe.id}"]`).addEventListener('change', (e) => {
                    const id = e.target.dataset.id;
                    const newServings = parseInt(e.target.value, 10);
                    if (selectedMeals.has(id) && !isNaN(newServings) && newServings > 0) {
                        selectedMeals.get(id).servings = newServings;
                    } else {
                        e.target.value = selectedMeals.get(id).servings; // Revert to old value if invalid
                    }
                });
            });
        }

        // --- Pantry Logic ---

        /**
         * Adds an item to the pantry list.
         */
        function addPantryItem() {
            const itemText = pantryInput.value.trim();
            if (itemText) {
                const normalizedItem = normalizeIngredientName(itemText);
                if (!pantryItems.has(normalizedItem)) {
                    pantryItems.add(normalizedItem);
                    renderPantryItems();
                } else {
                    showMessageBox('Already in Pantry', `${capitalizeWords(itemText)} is already in your pantry.`);
                }
                pantryInput.value = '';
            }
        }

        /**
         * Renders all items in the pantry list.
         */
        function renderPantryItems() {
            pantryListDiv.innerHTML = '';
            if (pantryItems.size === 0) {
                pantryListDiv.innerHTML = '<p class="text-gray-500">Your pantry is empty. Add some ingredients!</p>';
                return;
            }
            pantryItems.forEach(item => {
                const itemSpan = document.createElement('span');
                itemSpan.className = 'inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm';
                itemSpan.innerHTML = `
                    ${capitalizeWords(item)}
                    <button class="ml-2 text-blue-600 hover:text-blue-900" data-item="${item}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                `;
                pantryListDiv.appendChild(itemSpan);

                itemSpan.querySelector('button[data-item]').addEventListener('click', (e) => {
                    const itemToRemove = e.currentTarget.dataset.item;
                    pantryItems.delete(itemToRemove);
                    renderPantryItems();
                });
            });
        }

        // --- Grocery List Generation Logic ---

        /**
         * Generates and displays the grocery list.
         */
        function generateGroceryList() {
            if (selectedMeals.size === 0) {
                showMessageBox('No Meals Selected', 'Please select at least one meal to generate a grocery list.');
                return;
            }

            const combinedIngredients = new Map(); // { normalizedItem: { item: originalName, quantity: N, unit: unit, category: category } }
            const missingIngredients = new Set(); // Stores ingredients not in pantry for selected meals

            selectedMeals.forEach(({ recipe, servings: desiredServings }) => {
                const scalingFactor = desiredServings / recipe.servings;

                recipe.ingredients.forEach(ingredient => {
                    const normalizedItem = normalizeIngredientName(ingredient.item);
                    const scaledQuantity = ingredient.quantity * scalingFactor;

                    // If not in pantry, it's a missing ingredient
                    if (!pantryItems.has(normalizedItem)) {
                        missingIngredients.add(normalizedItem);
                    }

                    if (combinedIngredients.has(normalizedItem)) {
                        const existing = combinedIngredients.get(normalizedItem);
                        existing.quantity += scaledQuantity; // Sum quantities for same item
                    } else {
                        combinedIngredients.set(normalizedItem, {
                            item: ingredient.item,
                            quantity: scaledQuantity,
                            unit: ingredient.unit,
                            category: ingredient.category || 'Miscellaneous' // Default category
                        });
                    }
                });
            });

            // Group ingredients by category
            const categorizedList = {};
            combinedIngredients.forEach(ing => {
                // Only add to grocery list if not in pantry
                if (!pantryItems.has(normalizeIngredientName(ing.item))) {
                    const category = ing.category;
                    if (!categorizedList[category]) {
                        categorizedList[category] = [];
                    }
                    categorizedList[category].push(ing);
                }
            });

            // Sort categories and ingredients for consistent display
            const sortedCategories = Object.keys(categorizedList).sort();
            groceryListDiv.innerHTML = ''; // Clear previous list

            if (sortedCategories.length === 0) {
                groceryListDiv.innerHTML = '<p class="text-gray-500 text-center col-span-full">All ingredients for your selected meals are already in your pantry!</p>';
            } else {
                sortedCategories.forEach(category => {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'card p-6';
                    categoryDiv.innerHTML = `<h3 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">${category}</h3>`;
                    const ul = document.createElement('ul');
                    ul.className = 'list-disc pl-5 text-gray-700';

                    categorizedList[category].sort((a, b) => a.item.localeCompare(b.item)).forEach(ing => {
                        const li = document.createElement('li');
                        // Format quantity (e.g., 2.5 becomes "2.5", 2.0 becomes "2")
                        const displayQuantity = (ing.quantity % 1 === 0) ? ing.quantity : ing.quantity.toFixed(1);
                        li.textContent = `${displayQuantity} ${ing.unit ? ing.unit + ' ' : ''}${capitalizeWords(ing.item)}`;
                        ul.appendChild(li);
                    });
                    categoryDiv.appendChild(ul);
                    groceryListDiv.appendChild(categoryDiv);
                });
            }

            renderWasteOptimizationSuggestions();
            // This section is now handled by the tab logic, no direct show/hide here.
            // groceryListSection.classList.remove('hidden'); // REMOVE THIS LINE
            showTab('grocery-list'); // Automatically switch to grocery list tab
        }

        /**
         * Renders suggestions for waste optimization.
         * (Simplified for this mock example)
         */
        function renderWasteOptimizationSuggestions() {
            optimizationList.innerHTML = '';
            let hasSuggestions = false;

            // Suggest using pantry items that might be less common or have specific uses
            const suggestedPantryUses = [
                'Parmesan cheese', 'Canned diced tomatoes', 'Olive oil', 'Garlic'
            ];

            pantryItems.forEach(item => {
                if (suggestedPantryUses.includes(capitalizeWords(item))) {
                    const li = document.createElement('li');
                    li.textContent = `Consider using your existing ${capitalizeWords(item)} in other recipes this week.`;
                    optimizationList.appendChild(li);
                    hasSuggestions = true;
                }
            });

            // If selected meals used some ingredients but left others in pantry
            // This is a more complex logic, for simplicity we'll just check for unused pantry items
            if (pantryItems.size > 0 && selectedMeals.size > 0) {
                   const allRecipeIngredients = new Set();
                   selectedMeals.forEach(({ recipe }) => {
                       recipe.ingredients.forEach(ing => allRecipeIngredients.add(normalizeIngredientName(ing.item)));
                   });

                   pantryItems.forEach(pantryItem => {
                       if (!allRecipeIngredients.has(pantryItem)) {
                           const li = document.createElement('li');
                           li.textContent = `You have ${capitalizeWords(pantryItem)} in your pantry that wasn't used in your selected meals. Can you find another use for it?`;
                           optimizationList.appendChild(li);
                           hasSuggestions = true;
                       }
                   });
            }


            if (hasSuggestions) {
                wasteOptimizationSuggestions.classList.remove('hidden');
            } else {
                wasteOptimizationSuggestions.classList.add('hidden');
            }
        }

        // --- Tab Switching Logic ---
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        function showTab(tabId) {
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            // Deactivate all tab buttons
            tabButtons.forEach(button => button.classList.remove('active'));

            // Show the selected tab content
            document.getElementById(`${tabId}-content`).classList.add('active');
            // Activate the corresponding tab button
            document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');

            // Special handling for grocery list tab to ensure it's generated/updated
            if (tabId === 'grocery-list' && selectedMeals.size > 0) {
                // Ensure the list is current if the user navigates directly
                // (though generateGroceryList handles its own switching now)
                generateGroceryList();
            } else if (tabId === 'grocery-list') {
                 // If no meals are selected, clear the grocery list section content
                 groceryListDiv.innerHTML = '<p class="text-gray-500 text-center col-span-full">Select meals on the "Meal Plan & Pantry" tab to generate your grocery list.</p>'; // Updated text
                 wasteOptimizationSuggestions.classList.add('hidden');
            }
        }

        // --- Event Listeners ---

        // Meal input and suggestions
        mealInput.addEventListener('input', renderMealSuggestions);
        mealInput.addEventListener('focus', renderMealSuggestions); // Show suggestions on focus
        addMealBtn.addEventListener('click', () => {
            const mealName = mealInput.value.trim().toLowerCase();
            const recipe = mockRecipes.find(r => r.name.toLowerCase() === mealName);
            if (recipe) {
                addMealToSelection(recipe);
                mealInput.value = '';
                mealSuggestionsDiv.classList.add('hidden');
            } else if (mealName) {
                showMessageBox('Meal Not Found', `"${capitalizeWords(mealName)}" was not found in our recipe list.`);
            }
        });
        // Hide suggestions when clicking outside
        document.addEventListener('click', (event) => {
            if (!mealInput.contains(event.target) && !mealSuggestionsDiv.contains(event.target) && !addMealBtn.contains(event.target)) {
                mealSuggestionsDiv.classList.add('hidden');
            }
        });

        // Dietary preferences
        dietaryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', renderMealSuggestions);
        });

        // Pantry input
        addPantryItemBtn.addEventListener('click', addPantryItem);
        pantryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addPantryItem();
            }
        });

        // Generate list button
        generateListBtn.addEventListener('click', generateGroceryList); // This will now also switch the tab

        // Message box close button
        messageBoxCloseBtn.addEventListener('click', closeMessageBox);

        // Tab button event listeners
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                showTab(tabId);
            });
        });

        // --- Initial Render ---
        renderSelectedMeals(); // Initialize selected meals area
        renderPantryItems(); // Initialize pantry area
        showTab('home'); // Show the home tab by default when the page loads

        const container = document.getElementById('login-container');

        document.getElementById('signUp').addEventListener('click', () => {
        container.classList.add('right-panel-active');
        });

        document.getElementById('signIn').addEventListener('click', () => {
        container.classList.remove('right-panel-active');
        });
