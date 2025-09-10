import React from 'react';

// This is a placeholder component for the Login page.
// We will add form logic and API calls in the next step.
const LoginPage = ({ onToggleView, onLoginSuccess }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        
        <p className="text-center mb-4 text-gray-600">Login form will be built here.</p>
        
        <button 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          onClick={() => onLoginSuccess("fake_token_for_testing")} // Simulate a successful login for now
        >
          Log In (Test)
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button onClick={onToggleView} className="text-blue-500 hover:underline font-medium">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

