import React, { useState } from 'react';
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
              <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-gray-700">{user?.name || 'User'}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm text-gray-600">Role: {user?.role}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link to="/profile" className="px-4 py-2 hover:bg-gray-100 flex items-center" onClick={() => setDropdownOpen(false)}>
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
        <button className="md:hidden text-gray-600 hover:text-blue-600" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4">
          {navLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to} className=" px-3 py-2 rounded-md hover:bg-gray-100 flex items-center" onClick={() => setMobileMenuOpen(false)}>
              {icon} {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/profile" className=" px-3 py-2 rounded-md hover:bg-gray-100 flex items-center" onClick={() => setMobileMenuOpen(false)}>
                <LayoutDashboard className="mr-2" size={18} /> Profile
              </Link>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center text-red-600">
                <LogOut className="mr-2" size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
