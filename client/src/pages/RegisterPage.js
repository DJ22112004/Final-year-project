import React from 'react';

// This is a placeholder component for the Registration page.
const RegisterPage = ({ onToggleView }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        
        <p className="text-center mb-4 text-gray-600">Registration form will be built here.</p>
        
        <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors">
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={onToggleView} className="text-blue-500 hover:underline font-medium">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

