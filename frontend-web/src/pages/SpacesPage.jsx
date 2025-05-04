import React, { useState } from 'react';
import { Search } from 'lucide-react';
import NavigationBar from '../Components/NavigationBar.jsx';
import Footer from '../Components/Footer.jsx';
import SpaceShowcase from '../Components/SpaceShowcase.jsx';

const SpacesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationBar />
      <section className="px-4 py-10 bg-white sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto text-center"> {/* Added text-center here */}
          <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-800">Explore Our Study Spaces</h1>
          <p className="text-lg text-gray-600 font-poppins leading-relaxed mb-8 max-w-3xl mx-auto"> {/* Added mx-auto */}
            Discover a variety of study spaces to fit your needs. Whether you're looking for a quiet corner for focused work or a collaborative environment for group projects, we have options for you.
          </p>

          {/* Centered Search Bar */}
          <div className="mb-8 flex justify-center"> {/* Added flex and justify-center */}
            <div className={`relative flex items-center transition-all duration-300 max-w-xl w-full ${isFocused ? 'shadow-md' : 'shadow-sm'}`}>
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className={`h-5 w-5 transition-colors ${isFocused ? 'text-sky-500' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                placeholder="Find your perfect study environment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full p-4 pl-12 pr-4 bg-white border border-gray-300 rounded-xl font-poppins
                  focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
                  transition-all duration-300"
                aria-label="Search for a space"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 p-1 rounded-full hover:bg-gray-100"
                  aria-label="Clear search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {searchTerm && (
            <div className="text-sm text-gray-500 font-poppins flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Searching for: <span className="font-medium ml-1 text-sky-600">{searchTerm}</span>
            </div>
          )}
        </div>
      </section>

      {/* Space Showcase */}
      <section className="flex-grow">
        <SpaceShowcase searchTerm={searchTerm} />
      </section>

      <Footer />
    </div>
  );
};

export default SpacesPage;