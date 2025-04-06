import React, { useState } from 'react';

function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <section 
      className="relative bg-cover bg-center h-[60vh] min-h-[400px]" 
      style={{ backgroundImage: "url('/path-to-library-background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find your space here</h1>
          <p className="text-xl md:text-2xl mb-8">Discover study spaces that increase your productivity</p>
          <form 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            onSubmit={handleSearch}
          >
            <input 
              type="text" 
              placeholder="Enter location" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-lg text-black w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Hero;