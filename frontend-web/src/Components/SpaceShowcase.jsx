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
        const response = await fetch('/api/space/getAll'); 
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

  // Filter spaces based on searchTerm
  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="px-12 py-8 bg-white">
      {isLoading && <div className="text-center text-gray-500 py-4">Loading spaces...</div>}
      {error && <div className="text-center text-red-500 py-4">{error}</div>}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 px-4">
          {filteredSpaces.length > 0 ? (
            filteredSpaces.map(space => (
              <Link key={space.id} to={`/space/${space.id}`} className="block rounded-3xl overflow-hidden shadow-md transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50">
                <div>
                  {space.imageFilename ? (
                    <img
                      src={`/uploads/${space.imageFilename}`}
                      alt={space.name}
                      className="w-full h-80 object-cover"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image Available
                    </div>
                  )}
                  <div className="p-4 bg-white">
                    <h3 className="text-xl font-semibold mb-1 font-poppins truncate">{space.name}</h3>
                    <p className="text-gray-600 text-base mb-2 font-poppins">{space.location}</p>
                    <p className="text-lg font-semibold text-[#2F9FE5] font-poppins">{formatPrice(space.price)} / hour</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full py-4">Space not available</p>
          )}
        </div>
      )}
    </section>
  );
};

export default SpaceShowcase;