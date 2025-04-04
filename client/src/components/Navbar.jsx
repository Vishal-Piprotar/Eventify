/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
  ];

  // Close dropdown and mobile menu when clicking anywhere outside
  useEffect(() => {
    const handleGlobalClick = () => {
      if (isDropdownOpen) setDropdownOpen(false);
      if (isMobileMenuOpen) setMobileMenuOpen(false);
    };

    if (isDropdownOpen || isMobileMenuOpen) {
      setTimeout(() => {
        window.addEventListener('click', handleGlobalClick);
      }, 0);
    }

    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [isDropdownOpen, isMobileMenuOpen]);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setDropdownOpen(!isDropdownOpen);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  // Close dropdown when clicking a link inside it
  const handleDropdownLinkClick = () => {
    setDropdownOpen(false);
  };

  // Determine navbar classes based on authentication and theme
  const navbarClass = isAuthenticated
    ? `bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50`
    : `bg-white shadow-md sticky top-0 z-50`;

  // Determine mobile menu classes based on authentication and theme
  const mobileMenuClass = isAuthenticated
    ? `fixed md:hidden top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col`
    : `fixed md:hidden top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col`;

  return (
    <nav className={navbarClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className={isAuthenticated ? 'text-2xl font-bold text-blue-600 dark:text-blue-400' : 'text-2xl font-bold text-blue-600'}>
          Eventify
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={isAuthenticated ? 'flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-md' : 'flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md'}
            >
              {icon} <span>{label}</span>
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={handleDropdownToggle}
                className={isAuthenticated ? 'flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md' : 'flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md'}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className={isAuthenticated ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700'}>{user?.name || 'User'}</span>
              </button>
              {isDropdownOpen && (
                <div
                  className={isAuthenticated ? 'absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border rounded-lg shadow-lg border-gray-200 dark:border-gray-700' : 'absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg border-gray-200'}
                  onClick={handleMenuClick}
                >
                  <div className={isAuthenticated ? 'px-4 py-2 border-b border-gray-200 dark:border-gray-700' : 'px-4 py-2 border-b border-gray-200'}>
                    <p className={isAuthenticated ? 'text-sm text-gray-600 dark:text-gray-400' : 'text-sm text-gray-600'}>Role: {user?.role}</p>
                    <p className={isAuthenticated ? 'text-xs text-gray-500 dark:text-gray-400' : 'text-xs text-gray-500'}>{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className={isAuthenticated ? 'px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-gray-700 dark:text-gray-300' : 'px-4 py-2 hover:bg-gray-100 flex items-center text-gray-700'}
                    onClick={handleDropdownLinkClick} // Close dropdown on click
                  >
                    <LayoutDashboard className="mr-2" size={18} /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      handleDropdownLinkClick(); // Close dropdown on logout
                    }}
                    className={isAuthenticated ? 'w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-red-600 dark:text-red-400' : 'w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600'}
                  >
                    <LogOut className="mr-2" size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={isAuthenticated ? 'md:hidden text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400' : 'md:hidden text-gray-600 hover:text-blue-600'}
          onClick={handleMenuToggle}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - Positioned to slide from right */}
      {isMobileMenuOpen && (
        <div
          className={mobileMenuClass}
          onClick={handleMenuClick}
          style={{ transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)' }}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className={isAuthenticated ? 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}
            >
              <X size={24} />
            </button>
          </div>

          {/* Main menu content */}
          <div className="p-4 flex-grow">
            {navLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={isAuthenticated ? 'block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center mb-2 text-gray-700 dark:text-gray-300' : 'block px-3 py-2 rounded-md hover:bg-gray-100 flex items-center mb-2 text-gray-700'}
                onClick={() => setMobileMenuOpen(false)}
              >
                {icon} <span className="ml-2">{label}</span>
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={isAuthenticated ? 'block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center mb-2 text-gray-700 dark:text-gray-300' : 'block px-3 py-2 rounded-md hover:bg-gray-100 flex items-center mb-2 text-gray-700'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={18} /> <span className="ml-2">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={isAuthenticated ? 'w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-red-600 dark:text-red-400' : 'w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center text-red-600'}
                >
                  <LogOut size={18} /> <span className="ml-2">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md hover:bg-gray-100 mb-2 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* User profile at bottom */}
          {isAuthenticated && (
            <div className={isAuthenticated ? 'mt-auto border-t border-gray-200 dark:border-gray-700' : 'mt-auto border-t border-gray-200'}>
              <div className="flex items-center px-3 py-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className={isAuthenticated ? 'text-sm font-medium text-gray-700 dark:text-gray-300' : 'text-sm font-medium text-gray-700'}>{user?.name || 'User'}</p>
                  <p className={isAuthenticated ? 'text-xs text-gray-500 dark:text-gray-400' : 'text-xs text-gray-500'}>{user?.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 md:hidden z-40"></div>
      )}
    </nav>
  );
}