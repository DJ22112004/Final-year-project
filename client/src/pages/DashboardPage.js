import React from 'react';

// This is a placeholder for the main application dashboard.
const DashboardPage = ({ token, onLogout }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
       <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Dashboard</h2>
        <p className="mb-6 text-gray-600">Welcome! You are successfully logged in.</p>
        <button 
          onClick={onLogout}
          className="bg-red-500 text-white font-bold py-2 px-6 rounded hover:bg-red-600 transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;

