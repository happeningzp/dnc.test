import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

const Navigation = () => {
  return (
    // Light theme for navigation
    <nav className="bg-white text-gray-700 p-4 shadow-sm border-b border-gray-200">
      <ul className="container mx-auto flex items-center justify-start space-x-6"> {/* Increased space-x for better separation */}
        <li>
          <Link 
            to="/" 
            className="hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/dashboard" 
            className="hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
          >
            Task Dashboard
          </Link>
        </li>
      </ul>
    </nav>
  );
};

function App() {
  return (
    // Using bg-gray-50 for a very light gray background
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans"> 
      <Navigation />
      {/* Ensure main content area has good padding and max-width for larger screens */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8"> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
