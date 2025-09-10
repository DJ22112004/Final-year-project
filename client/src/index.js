import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // NOTE: <React.StrictMode> has been removed. This is the primary fix 
  // for the "THREE.WebGLRenderer: Context Lost" error in development.
  <App />
);