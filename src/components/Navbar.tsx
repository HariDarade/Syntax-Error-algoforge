import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  console.log('Navbar rendering, user:', user); // Debug log

  // Determine the dashboard path based on the user's role
  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'patient':
        return '/patient-dashboard';
      case 'hospital':
        return '/hospital-dashboard';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">MediQueue</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/' ? 'border-white' : 'border-transparent hover:border-gray-300'
                }`}
              >
                Home
              </Link>
              {user && (
                <>
                  <Link
                    to={getDashboardPath()}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === getDashboardPath()
                        ? 'border-white'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    Dashboard
                  </Link>
                  {/* Conditionally render links based on user role */}
                  {user.role === 'patient' && (
                    <Link
                      to="/queue"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        location.pathname === '/queue' ? 'border-white' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      Live Queue
                    </Link>
                  )}
                  {user.role === 'hospital' && (
                    <Link
                      to="/hospital-reports"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        location.pathname === '/hospital-reports'
                          ? 'border-white'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      Hospital Reports
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <>
                      <Link
                        to="/queue"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          location.pathname === '/queue' ? 'border-white' : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        Live Queue
                      </Link>
                      <Link
                        to="/analytics"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          location.pathname === '/analytics' ? 'border-white' : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        Analytics
                      </Link>
                      <Link
                        to="/ai-predictions"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          location.pathname === '/ai-predictions' ? 'border-white' : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        AI Predictions
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">{user.username}</span>
                <button
                  onClick={() => {
                    console.log('Logout clicked'); // Debug log
                    logout();
                  }}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;