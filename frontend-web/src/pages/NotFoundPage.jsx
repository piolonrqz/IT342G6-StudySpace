import React from 'react';
import { Link } from 'react-router-dom';
import NavigationBar from '@/Components/NavigationBar'; // Import NavigationBar
import Footer from '@/Components/Footer'; // Import Footer

const NotFoundPage = () => {
  return (
    <div className="flex flex-col min-h-screen font-poppins"> {/* Added flex container and font */}
      <NavigationBar />
      <div className="flex flex-grow flex-col items-center justify-center text-center px-4"> {/* Added flex-grow */} 
        <h1 className="text-7xl font-bold mb-4 text-sky-500">404</h1> {/* Adjusted size and color */}
        <p className="text-2xl mb-4 text-gray-900">Oops! Page Not Found.</p> {/* Adjusted size and color */}
        <p className="mb-8 text-lg text-gray-600"> {/* Adjusted size and color */}
          The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 text-white bg-sky-500 rounded-3xl hover:bg-sky-400 font-poppins" // Matched button style
        >
          Go Back Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
