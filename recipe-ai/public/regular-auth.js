// regular-auth.js

// Handle switching between Sign Up and Sign In panels
function setupFormSwitching() {
  const container = document.getElementById('login-container');
  const signUpButton = document.getElementById('signUp');
  const signInButton = document.getElementById('signIn');

  if (signUpButton && container) {
    signUpButton.addEventListener('click', () => {
      container.classList.add('right-panel-active');
    });
  }

  if (signInButton && container) {
    signInButton.addEventListener('click', () => {
      container.classList.remove('right-panel-active');
    });
  }
}

// Handle Sign Up form submission
async function handleSignUp(event) {
  event.preventDefault();

  const name = document.getElementById('sign-up-name').value.trim();
  const email = document.getElementById('sign-up-email').value.trim();
  const password = document.getElementById('sign-up-password').value;

  if (!name || !email || !password) {
    alert('Please fill in all sign-up fields.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      alert('Failed to register user.');
      return;
    }

    const data = await response.json();

    if (data.status === 'success') {
      alert('Registration successful! Please sign in.');
      // Switch to sign-in form after successful registration
      document.getElementById('login-container').classList.remove('right-panel-active');
      // Optionally reset form
      event.target.reset();
    } else {
      alert('Registration failed: ' + data.message);
    }
  } catch (error) {
    alert('Error registering user.');
    console.error('Sign-up error:', error);
  }
}

// Handle Sign In form submission
async function handleSignIn(event) {
  event.preventDefault();

  const email = document.getElementById('sign-in-email').value.trim();
  const password = document.getElementById('sign-in-password').value;

  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      alert('Login request failed.');
      return;
    }

    const data = await response.json();

    if (data.status === 'success') {
      alert('Login successful! Redirecting...');
      // Redirect to main page after successful login
      window.location.href = 'index.html';
    } else {
      alert('Login failed: ' + data.message);
    }
  } catch (error) {
    alert('Error signing in.');
    console.error('Sign-in error:', error);
  }
}

// Initialize event listeners on page load
window.addEventListener('load', () => {
  setupFormSwitching();

  const signUpForm = document.getElementById('sign-up-form');
  if (signUpForm) signUpForm.addEventListener('submit', handleSignUp);

  const signInForm = document.getElementById('sign-in-form');
  if (signInForm) signInForm.addEventListener('submit', handleSignIn);
});