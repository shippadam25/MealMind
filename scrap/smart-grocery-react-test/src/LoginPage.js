import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = ({ showMessage, onLoginSuccess, setActiveTab, authReady, firebaseAuth }) => {
  // State to manage whether the sign-in panel is active (true) or sign-up (false)
  const [isSignInActive, setIsSignInActive] = useState(true);

  // State for sign-up form inputs
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // State for sign-in form inputs
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Function to handle Google Sign-In
  const handleGoogleSignIn = async () => {
    if (!firebaseAuth) {
      showMessage('Authentication Error', 'Firebase Auth is not initialized yet. Please wait.');
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(firebaseAuth, provider); // Use firebaseAuth prop
      onLoginSuccess(); // Call success callback to navigate
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      showMessage('Google Sign-In Failed', `Error: ${error.message}`);
    }
  };

  // Function to handle email/password sign-up
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!firebaseAuth) {
      showMessage('Authentication Error', 'Firebase Auth is not initialized yet. Please wait.');
      return;
    }
    try {
      await createUserWithEmailAndPassword(firebaseAuth, signUpEmail, signUpPassword); // Use firebaseAuth prop
      showMessage('Sign Up Success', `Account created for: ${signUpEmail}. Please sign in.`);
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPassword('');
      setIsSignInActive(true); // Switch to sign-in panel
      setSignInEmail(signUpEmail); // Pre-fill sign-in email
    } catch (error) {
      console.error('Sign Up Error:', error);
      showMessage('Sign Up Failed', `Error: ${error.message}`);
    }
  };

  // Function to handle email/password sign-in
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!firebaseAuth) {
      showMessage('Authentication Error', 'Firebase Auth is not initialized yet. Please wait.');
      return;
    }
    try {
      await signInWithEmailAndPassword(firebaseAuth, signInEmail, signInPassword); // Use firebaseAuth prop
      onLoginSuccess(); // Call success callback to navigate
    } catch (error) {
      console.error('Sign In Error:', error);
      showMessage('Login Failed', `Error: ${error.message}`);
    }
  };

  // Show a loading indicator until auth state is determined
  if (!authReady || !firebaseAuth) { // Also check if firebaseAuth is available
    return (
      <div className="login-page-wrapper flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="login-page-wrapper">
      {/* Back Button */}
      <button
        className="back-button"
        onClick={() => setActiveTab('home')}
      >
        &larr; Back to Home
      </button>

      <h2 id="login-header">Sign in/up Form</h2>

      {/* Main Container */}
      <div
        id="login-container"
        className={isSignInActive ? '' : 'right-panel-active'}
      >
        {/* Sign Up Form Container */}
        <div id="sign-up-container" className="form-container sign-up-container">
          <form id="sign-up-form" onSubmit={handleSignUpSubmit}>
            <h1 id="sign-up-title">Create Account</h1>
            <div id="sign-up-social" className="social-container">
              {/* Replaced Font Awesome icon with inline SVG for Google logo */}
              <a href="#" className="social" onClick={handleGoogleSignIn}>
                <svg viewBox="0 0 48 48" width="24px" height="24px" style={{ display: 'block' }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.6-6.44C38.71 3.82 32.65 1 24 1 14.32 1 5.92 6.5 2.18 14.85l7.74 6.02C12.42 12.55 17.71 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.72 24.5c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.9 7.27l7.74 6.02c4.51-4.18 7.15-10.59 7.15-18.74z"></path>
                  <path fill="#FBBC04" d="M9.21 28.1c-.91-2.61-.91-5.32 0-7.93l-7.74-6.02C1.4 17.54 1 20.2 1 24c0 3.79.4 6.46 1.45 8.71l7.76 6.07c-2.43-4.18-3.95-8.71-3.95-13.08z"></path>
                  <path fill="#34A853" d="M24 47c6.28 0 11.75-2.06 15.66-5.6l-7.74-6.02c-2.48 1.6-5.64 2.62-7.92 2.62-6.29 0-11.64-4.22-13.68-9.91l-7.74 6.02C5.92 41.5 14.32 47 24 47z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </a>
            </div>
            <span id="sign-up-or">or use your email for registration</span>
            <input
              id="sign-up-name"
              type="text"
              placeholder="Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              required
            />
            <input
              id="sign-up-email"
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
            />
            <input
              id="sign-up-password"
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
            />
            <button id="sign-up-button" type="submit">
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In Form Container */}
        <div id="sign-in-container" className="form-container sign-in-container">
          <form id="sign-in-form" onSubmit={handleSignInSubmit}>
            <h1 id="sign-in-title">Sign in</h1>
            <div id="sign-in-social" className="social-container">
              {/* Replaced Font Awesome icon with inline SVG for Google logo */}
              <a href="#" className="social" onClick={handleGoogleSignIn}>
                <svg viewBox="0 0 48 48" width="24px" height="24px" style={{ display: 'block' }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.6-6.44C38.71 3.82 32.65 1 24 1 14.32 1 5.92 6.5 2.18 14.85l7.74 6.02C12.42 12.55 17.71 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.72 24.5c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.9 7.27l7.74 6.02c4.51-4.18 7.15-10.59 7.15-18.74z"></path>
                  <path fill="#FBBC04" d="M9.21 28.1c-.91-2.61-.91-5.32 0-7.93l-7.74-6.02C1.4 17.54 1 20.2 1 24c0 3.79.4 6.46 1.45 8.71l7.76 6.07c-2.43-4.18-3.95-8.71-3.95-13.08z"></path>
                  <path fill="#34A853" d="M24 47c6.28 0 11.75-2.06 15.66-5.6l-7.74-6.02c-2.48 1.6-5.64 2.62-7.92 2.62-6.29 0-11.64-4.22-13.68-9.91l-7.74 6.02C5.92 41.5 14.32 47 24 47z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </a>
            </div>
            <span id="sign-in-or">or use your account</span>
            <input
              id="sign-in-email"
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              required
            />
            <input
              id="sign-in-password"
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              required
            />
            <a href="#" id="forgot-password">Forgot your password?</a>
            <button id="sign-in-button" type="submit">
              Sign In
            </button>
          </form>
        </div>

        {/* Overlay Container */}
        <div id="overlay-container" className="overlay-container">
          <div id="overlay" className="overlay">
            {/* Overlay Left Panel (for Sign In) */}
            <div id="overlay-left" className="overlay-panel overlay-left">
              <h1 id="overlay-left-title">Welcome Back!</h1>
              <p id="overlay-left-text">To keep connected with us please login with your personal info</p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => setIsSignInActive(true)}
              >
                Sign In
              </button>
            </div>

            {/* Overlay Right Panel (for Sign Up) */}
            <div id="overlay-right" className="overlay-panel overlay-right">
              <h1 id="overlay-right-title">Hello, Friend!</h1>
              <p id="overlay-right-text">Enter your personal details and start journey with us</p>
              <button
                className="ghost"
                id="signUp"
                onClick={() => setIsSignInActive(false)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
