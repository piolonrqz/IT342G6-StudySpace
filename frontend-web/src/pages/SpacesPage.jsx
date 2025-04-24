import React, { useState } from 'react';
import NavigationBar from '../Components/NavigationBar.jsx'; // Import NavigationBar
import Footer from '../Components/Footer.jsx'; // Import Footer
import SpaceShowcase from '../Components/SpaceShowcase.jsx'; // Import SpaceShowcase

const SpacesPage = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <section className="px-12 py-8 bg-white">
        <h1 className="text-4xl font-bold font-poppins mb-8">Explore Our Study Spaces</h1>
        <p className="text-lg text-gray-700 font-poppins leading-relaxed mb-8">
          Discover a variety of study spaces to fit your needs. Whether you're looking for a quiet corner for focused work or a collaborative environment for group projects, we have options for you.
        </p>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search for a space..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>
      </section>

      {/* Space Showcase */}
      <section className="px-12 py-8 bg-gray-50 flex-grow">
        <SpaceShowcase searchTerm={searchTerm} />
      </section>

      <Footer />
    </div>
  );
};

export default SpacesPage;