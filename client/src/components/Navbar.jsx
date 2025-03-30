import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
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
    { to: '/events', label: 'Events'}
  ];

  // Close dropdown and mobile menu when clicking anywhere
  useEffect(() => {
    const handleGlobalClick = () => {
      if (isDropdownOpen) {
        setDropdownOpen(false);
      }
      if (isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    // Add global click listener to handle closing
    if (isDropdownOpen || isMobileMenuOpen) {
      // Use setTimeout to ensure this event listener runs after the current click event
      setTimeout(() => {
        window.addEventListener('click', handleGlobalClick);
      }, 0);
    }

    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [isDropdownOpen, isMobileMenuOpen]);

  // Prevent menu toggle buttons from triggering the global click handler
  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setDropdownOpen(!isDropdownOpen);
  };

  // Prevent clicks inside menus from closing them
  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-bold text-blue-600">Eventify</Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md">
              {icon} <span>{label}</span>
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={handleDropdownToggle} 
                className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-gray-700">{user?.name || 'User'}</span>
              </button>
              {isDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg"
                  onClick={handleMenuClick}
                >
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm text-gray-600">Role: {user?.role}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link to="/profile" className="px-4 py-2 hover:bg-gray-100 flex items-center">
                    <LayoutDashboard className="mr-2" size={18} /> Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600">
                    <LogOut className="mr-2" size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-gray-600 hover:text-blue-600" 
          onClick={handleMenuToggle}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - Positioned to slide from right */}
      {isMobileMenuOpen && (
        <div 
          className="fixed md:hidden top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col"
          onClick={handleMenuClick}
          style={{ transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)' }}
        >
          <div className="flex justify-end p-4">
            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-blue-600">
              <X size={24} />
            </button>
          </div>
          
          {/* Main menu content */}
          <div className="p-4 flex-grow">
            {navLinks.map(({ to, label, icon }) => (
              <Link key={to} to={to} className="block px-3 py-2 rounded-md hover:bg-gray-100 flex items-center mb-2" onClick={() => setMobileMenuOpen(false)}>
                {icon} <span className="ml-2">{label}</span>
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block px-3 py-2 rounded-md hover:bg-gray-100 flex items-center mb-2" onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard size={18} /> <span className="ml-2">Profile</span>
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center text-red-600">
                  <LogOut size={18} /> <span className="ml-2">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md hover:bg-gray-100 mb-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
          
          {/* User profile at bottom */}
          {isAuthenticated && (
            <div className="mt-auto border-t border-gray-200">
              <div className="flex items-center px-3 py-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden z-40"
        ></div>
      )}
    </nav>
  );
}