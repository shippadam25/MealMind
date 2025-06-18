const ingredients = [];

document.getElementById('add-btn').addEventListener('click', addIngredient);
document.getElementById('search-btn').addEventListener('click', getRecipes);

document.getElementById('loginSubmit').addEventListener('click', () => {
  const user = document.getElementById('usernameInput').value.trim();
  const pass = document.getElementById('passwordInput').value.trim();
  const msg = document.getElementById('loginMessage');

  if (user === 'admin' && pass === 'password') {
    msg.classList.remove('text-danger');
    msg.classList.add('text-success');
    msg.textContent = 'Login successful!';
    // Optionally close dropdown after login:
    // bootstrap.Dropdown.getInstance(document.getElementById('dropdownLogin')).hide();
  } else {
    msg.classList.remove('text-success');
    msg.classList.add('text-danger');
    msg.textContent = 'Invalid username or password.';
  }
});





document.getElementById('ingredient-input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    addIngredient();
  }
});

function addIngredient() {
  const input = document.getElementById('ingredient-input');
  const value = input.value.trim();
  if (value && !ingredients.includes(value.toLowerCase())) {
    ingredients.push(value.toLowerCase());
    input.value = '';
    updateIngredientList();
  }
}

function updateIngredientList() {
  const list = document.getElementById('ingredient-list');
  list.innerHTML = '';

  ingredients.forEach((ing, index) => {
    const span = document.createElement('span');
    span.className = 'ingredient';
    span.textContent = ing;
    span.addEventListener('click', () => {
      ingredients.splice(index, 1);
      updateIngredientList();
    });
    list.appendChild(span);
  });
}


function getRecipes() {
  const results = document.getElementById('recipe-results');
  results.innerHTML = '';

  const sampleRecipes = [
    { name: "Tomato Omelette", ingredients: ["eggs", "tomatoes", "onion"] },
    { name: "Avocado Toast", ingredients: ["bread", "avocado", "salt"] },
    { name: "Pasta Salad", ingredients: ["pasta", "tomatoes", "olive oil"] },
    { name: "Veggie Stir Fry", ingredients: ["broccoli", "carrot", "soy sauce"] }
  ];

  const matched = sampleRecipes.filter(recipe =>
    recipe.ingredients.every(i => ingredients.includes(i))
  );

  if (matched.length === 0) {
    results.innerHTML = '<p>No matching recipes found. Try adding more ingredients.</p>';
  } else {
    matched.forEach(r => {
      results.innerHTML += `
        <div class="recipe">
          <h3>${r.name}</h3>
          <p><strong>Ingredients:</strong> ${r.ingredients.join(', ')}</p>
        </div>`;
    });
  }
}
