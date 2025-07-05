// AuthPage.js
import React, { useState } from 'react';

const AuthPage = ({ onLoginSuccess, showMessage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const normalizeEmail = (email) => email.toLowerCase().trim();

  const handleAuth = async (event) => {
    event.preventDefault();
    setError('');

    if (isLogin) {
      // Handle Login
      // In a real app, you'd make an API call here
      if (normalizeEmail(email) === 'user@example.com' && password === 'password') {
        showMessage('Login Successful', 'Welcome back!');
        onLoginSuccess({ email: normalizeEmail(email) }); // Pass user data to App
      } else {
        setError('Invalid email or password.');
        showMessage('Login Failed', 'Invalid email or password.');
      }
    } else {
      // Handle Signup
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        showMessage('Signup Failed', 'Passwords do not match.');
        return;
      }
      // In a real app, you'd make an API call here to register the user
      // For now, a simple mock success
      if (email && password) {
        showMessage('Signup Successful', 'Your account has been created!');
        setIsLogin(true); // Switch to login after signup
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError('Please fill in all fields.');
        showMessage('Signup Failed', 'Please fill in all fields.');
      }
    }
  };

  return (
    <div className="tab-content-container flex justify-center items-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleAuth}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;