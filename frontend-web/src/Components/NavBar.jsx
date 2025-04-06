import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <img 
            src="/path-to-your-logo.png" 
            alt="StudySpace Logo" 
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold text-gray-800">StudySpace</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            to="/spaces" 
            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            Spaces
          </Link>
          <Link 
            to="/how-it-works" 
            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            How It Works
          </Link>
          <Link 
            to="/testimonials" 
            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            Testimonials
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex space-x-4">
          <Link to="/LoginPage">
            <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200">
              Login
            </button>
          </Link>
          <Link to="/RegisterPage">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              Register
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;