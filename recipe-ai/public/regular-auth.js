// Regular Authentication Functions

// Utility functions for better UX
function showError(message) {
  // You can customize this to show errors in a nicer way
  alert(message);
}

function showSuccess(message) {
  // You can customize this to show success messages in a nicer way
  alert(message);
}

function showLoading(button) {
  button.disabled = true;
  button.textContent = 'Loading...';
}

function hideLoading(button, originalText) {
  button.disabled = false;
  button.textContent = originalText;
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation
function isValidPassword(password) {
  return password.length >= 6; // Minimum 6 characters
}

// Handle regular signup
async function handleRegularSignup(name, email, password) {
  try {
    const response = await fetch('http://localhost/recipe-ai/public/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        name: name,
        email: email,
        password: password
      })
    });

    const result = await response.text();
    
    if (response.ok && result.includes('Registration successful')) {
      showSuccess('Registration successful! Please sign in.');
      // Switch to sign-in form
      const container = document.getElementById('login-container');
      if (container) {
        container.classList.remove('right-panel-active');
      }
      // Clear the signup form
      document.getElementById('sign-up-form').reset();
    } else {
      showError(result || 'Registration failed. Please try again.');
    }
  } catch (error) {
    console.error('Signup error:', error);
    showError('Network error. Please try again.');
  }
}

// Handle regular signin
async function handleRegularSignin(email, password) {
  try {
    const response = await fetch('http://localhost/recipe-ai/public/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: email,
        password: password
      })
    });

    const result = await response.text();  // <-- get plain text

    if (result === 'success') {
      // Save username in localStorage (you can save the email or username from your form)
      localStorage.setItem('username', email);

      // Redirect to home page
      window.location.href = 'http://127.0.0.1:5500/recipe-ai/public/index.html';
    } else {
      showError(result || 'Login failed. Please check your credentials.');
    }

  } catch (error) {
    console.error('Signin error:', error);
    showError('Network error. Please try again.');
  }
}

// Handle traditional form submissions
function setupRegularAuthForms() {
  const signUpForm = document.getElementById('sign-up-form');
  const signInForm = document.getElementById('sign-in-form');
  
  if (signUpForm) {
      signUpForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const submitButton = signUpForm.querySelector('button[type="submit"]');
          const originalText = submitButton.textContent;
          
          const name = document.getElementById('sign-up-name').value.trim();
          const email = document.getElementById('sign-up-email').value.trim();
          const password = document.getElementById('sign-up-password').value;
          
          // Basic validation
          if (!name || !email || !password) {
              showError('Please fill in all fields');
              return;
          }
          
          if (!isValidEmail(email)) {
              showError('Please enter a valid email address');
              return;
          }
          
          if (!isValidPassword(password)) {
              showError('Password must be at least 6 characters long');
              return;
          }
          
          showLoading(submitButton);
          
          try {
              await handleRegularSignup(name, email, password);
          } finally {
              hideLoading(submitButton, originalText);
          }
      });
  }
  
  if (signInForm) {
      signInForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const submitButton = signInForm.querySelector('button[type="submit"]');
          const originalText = submitButton.textContent;
          
          const email = document.getElementById('sign-in-email').value.trim();
          const password = document.getElementById('sign-in-password').value;
          
          // Basic validation
          if (!email || !password) {
              showError('Please fill in both email and password');
              return;
          }
          
          if (!isValidEmail(email)) {
              showError('Please enter a valid email address');
              return;
          }
          
          showLoading(submitButton);
          
          try {
              await handleRegularSignin(email, password);
          } finally {
              hideLoading(submitButton, originalText);
          }
      });
  }
}

// Form switching logic (keeping it separate in case you want to customize)
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

// Initialize regular authentication when page loads
window.addEventListener('load', () => {
  // Set up form switching
  setupFormSwitching();
  
  // Set up regular form handling
  setupRegularAuthForms();
});

// Add Enter key support for better UX
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
      // Check if we're in a form and trigger submission
      const activeElement = document.activeElement;
      if (activeElement && activeElement.form) {
          const submitButton = activeElement.form.querySelector('button[type="submit"], button:not([type])');
          if (submitButton) {
              submitButton.click();
          }
      }
  }
});

// Optional: Add real-time validation feedback
function setupRealTimeValidation() {
  const emailInputs = document.querySelectorAll('input[type="email"]');
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  
  emailInputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value && !isValidEmail(input.value)) {
        input.style.borderColor = '#ff4444';
      } else {
        input.style.borderColor = '';
      }
    });
  });
  
  passwordInputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value && !isValidPassword(input.value)) {
        input.style.borderColor = '#ff4444';
      } else {
        input.style.borderColor = '';
      }
    });
  });
}

// Initialize real-time validation
window.addEventListener('load', setupRealTimeValidation);
