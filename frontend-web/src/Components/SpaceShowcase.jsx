import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Helper function for formatting price
const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(Number(price))) {
    return 'N/A'; 
  }
  return `₱${Number(price).toFixed(2)}`;
};

const SpaceShowcase = ({ searchTerm = "" }) => {
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/space/getAll`); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSpaces(data); 
      } catch (e) {
        console.error("Failed to fetch spaces:", e);
        setError("Failed to load spaces. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  // Filter spaces based on searchTerm and availability
  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    space.available
  );

  return (
    <section className="px-4 py-10 bg-white sm:px-8 lg:px-12">
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#2F9FE5] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-poppins">Loading spaces...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200 text-red-500 py-4 max-w-md mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error}</p>
        </div>
      )}
      
      {!isLoading && !error && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-1">Available Spaces</h2>
            <p className="text-gray-500 font-poppins">Find your perfect study environment</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSpaces.length > 0 ? (
              filteredSpaces.map(space => (
                <Link 
                  key={space.id} 
                  to={`/space/${space.id}`} 
                  className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative overflow-hidden h-60">
                    {space.imageFilename ? (
                      <img
                        src={space.imageFilename}
                        alt={space.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="ml-2">No Image Available</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white font-semibold text-sm">View details</span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold mb-1 font-poppins truncate">{space.name}</h3>
                    <div className="flex items-center mb-3 text-gray-600 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="font-poppins truncate">{space.location}</p>
                    </div>
                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <p className="text-lg font-semibold text-[#2F9FE5] font-poppins flex items-center">
                        {formatPrice(space.price)} / hour
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-center text-gray-500 font-poppins">No spaces available matching your criteria</p>
                <p className="text-center text-gray-400 text-sm mt-1 font-poppins">Try adjusting your search or check back later</p>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default SpaceShowcase;