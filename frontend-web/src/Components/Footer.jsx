import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component

const Footer = () => {
  return (
    <footer className="bg-blue-50 px-12 py-8 mt-auto">
      <div className="grid grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-4 font-poppins">StudySpace</h3>
          <p className="text-sm text-gray-600 font-poppins">
            Find and book the perfect study space anywhere.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4 font-poppins">Quick Links</h3>
          <ul className="space-y-2 text-sm font-poppins">
            <li><Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
            <li><Link to="/sign-up" className="text-gray-600 hover:text-gray-900">Sign Up</Link></li>
            <li><Link to="/find-a-space" className="text-gray-600 hover:text-gray-900">Find a Space</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 font-poppins">Contacts</h3>
          <p className="text-sm text-gray-600 font-poppins">Email: info@studyspace.com</p>
          <p className="text-sm text-gray-600 font-poppins">Phone: (123) 456-7890</p>
        </div>

        <div>
          <h3 className="font-semibold mb-4 font-poppins">Legal</h3>
          <ul className="space-y-2 text-sm font-poppins">
            <li><Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</Link></li>
            <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500 font-poppins">
        &copy; 2025 StudySpace. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;