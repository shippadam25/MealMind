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
              <a href="#" className="social" onClick={handleGoogleSignIn}>
                <i className="fab fa-google-plus-g"></i>
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
              <a href="#" className="social" onClick={handleGoogleSignIn}>
                <i className="fab fa-google-plus-g"></i>
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
