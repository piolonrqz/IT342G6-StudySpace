import React from 'react';
import { Link } from 'react-router-dom';

export const NavigationBar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center">
        <img src="/logo.png" alt="StudySpace" className="h-8" />
        <span className="ml-2 text-xl font-semibold text-sky-500 font-poppins">StudySpace</span>
      </div>

      <div className="flex space-x-6">
        <Link to="/" className="text-gray-900 hover:text-indigo-400 font-poppins">Home</Link>
        <Link to="/SpacesPage" className="text-gray-900 hover:text-indigo-400 font-poppins">Spaces</Link>
        <Link to="/why-study-space" className="text-gray-900 hover:text-indigo-400 font-poppins">Why StudySpace</Link>
        <Link to="/bookings" className="text-gray-900 hover:text-indigo-400 font-poppins">Bookings</Link>
      </div>

      <div className="flex space-x-4">
        <Link to="/LoginPage" className="px-4 py-2 font-medium text-sky-500 border border-sky-500 rounded hover:bg-blue-50 font-poppins">Log in</Link>
        <Link to="/RegisterPage" className="px-4 py-2 font-medium text-white bg-sky-500 rounded hover:bg-sky-500 font-poppins">Register</Link>
      </div>
    </nav>
  );
};
export default NavigationBar;