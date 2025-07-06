// Google Sign-In Configuration
const GOOGLE_CLIENT_ID = '702852647652-2a1a7uv3e8m1rfurrinvo43n2q59q8vn.apps.googleusercontent.com'; // Replace with your actual client ID

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleSignIn,
    ux_mode: "redirect",
    login_uri: "http://127.0.0.1:5500/recipe-ai/public/index.html" // 👈 Where Google redirects after login
  });

  // Render buttons
  const signInDiv = document.getElementById('sign-in-google');
  const signUpDiv = document.getElementById('sign-up-google');

  if (signInDiv) {
    google.accounts.id.renderButton(signInDiv, {
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
    });
  }

  if (signUpDiv) {
    google.accounts.id.renderButton(signUpDiv, {
      theme: "outline",
      size: "large",
      text: "signup_with",
      shape: "rectangular",
    });
  }
}


// Handle Google Sign-In response
function handleGoogleSignIn(response) {
  try {
      // Decode the JWT token to get user info
      const userInfo = parseJwt(response.credential);
      
      console.log('Google Sign-In successful:', userInfo);
      
      // Extract user information
      const userData = {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          googleId: userInfo.sub
      };
      
      // Here you would typically:
      // 1. Send the token to your backend for verification
      // 2. Create/login the user in your system
      // 3. Redirect to dashboard or home page
      
      handleSuccessfulLogin(userData);
      
  } catch (error) {
      console.error('Error handling Google Sign-In:', error);
      alert('Sign-in failed. Please try again.');
  }
}

// Parse JWT token (client-side parsing for display purposes only)
function parseJwt(token) {
  try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
  } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
  }
}

// Handle successful login (customize this based on your needs)
function handleSuccessfulLogin(userData) {
  console.log('Login successful, redirecting to home page...');
  
  // Store user data in URL parameters for the home page
  const userParams = new URLSearchParams({
      name: userData.name,
      email: userData.email,
      picture: userData.picture || '',
      googleId: userData.googleId
  });
  
  // Redirect to home page with user data
  window.location.href = `http://127.0.0.1:5500/recipe-ai/public/index.html?${userParams.toString()}`;
}

// Trigger Google Sign-In when buttons are clicked
function setupGoogleSignInButtons() {
  const signUpGoogleBtn = document.getElementById('sign-up-google');
  const signInGoogleBtn = document.getElementById('sign-in-google');
  
  if (signUpGoogleBtn) {
      signUpGoogleBtn.addEventListener('click', (e) => {
          e.preventDefault();
          google.accounts.id.prompt();
      });
  }
  
  if (signInGoogleBtn) {
      signInGoogleBtn.addEventListener('click', (e) => {
          e.preventDefault();
          google.accounts.id.prompt();
      });
  }
}

// Handle traditional form submissions
function setupTraditionalForms() {
  const signUpForm = document.getElementById('sign-up-form');
  const signInForm = document.getElementById('sign-in-form');
  
  if (signUpForm) {
      signUpForm.addEventListener('submit', (e) => {
          e.preventDefault();
          
          const name = document.getElementById('sign-up-name').value;
          const email = document.getElementById('sign-up-email').value;
          const password = document.getElementById('sign-up-password').value;
          
          // Basic validation
          if (!name || !email || !password) {
              alert('Please fill in all fields');
              return;
          }
          
          // Here you would typically send data to your backend
          console.log('Sign-up attempt:', { name, email, password: '[REDACTED]' });
          alert('Sign-up functionality would be implemented here');
      });
  }
  
  if (signInForm) {
      signInForm.addEventListener('submit', (e) => {
          e.preventDefault();
          
          const email = document.getElementById('sign-in-email').value;
          const password = document.getElementById('sign-in-password').value;
          
          // Basic validation
          if (!email || !password) {
              alert('Please fill in both email and password');
              return;
          }
          
          // Here you would typically send data to your backend
          console.log('Sign-in attempt:', { email, password: '[REDACTED]' });
          alert('Sign-in functionality would be implemented here');
      });
  }
}

// Form switching logic
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

// Initialize everything when page loads
window.addEventListener('load', () => {
  // Set up form switching
  setupFormSwitching();
  
  // Set up traditional form handling
  setupTraditionalForms();
  
  // Wait for Google Sign-In library to load
  if (typeof google !== 'undefined' && google.accounts) {
      initializeGoogleSignIn();
      setupGoogleSignInButtons();
  } else {
      // Retry after a short delay if Google library isn't loaded yet
      setTimeout(() => {
          if (typeof google !== 'undefined' && google.accounts) {
              initializeGoogleSignIn();
              setupGoogleSignInButtons();
          } else {
              console.error('Google Sign-In library failed to load');
          }
      }, 1000);
  }
});

// Optional: Add Enter key support for better UX
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

