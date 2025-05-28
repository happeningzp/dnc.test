import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './routes/ProtectedRoute';
// import './App.css'; // Remove App.css import

const Navigation = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <ul className="container mx-auto flex items-center justify-between">
        <div className="flex space-x-4">
          <li>
            <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
          </li>
        </div>
        <div className="flex space-x-4 items-center">
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/dashboard" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard ({user?.name || user?.email})
                </Link>
              </li>
              {/* Logout button is in DashboardPage, or could be moved here */}
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Register</Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <Navigation />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
