import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { getUserIdentifier } from './utils/userIdentifier'; // Import the utility

// Ensure user identifier cookie is set or generated on app load
getUserIdentifier(); 
console.log('User identifier initialized/verified from main.jsx.');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
