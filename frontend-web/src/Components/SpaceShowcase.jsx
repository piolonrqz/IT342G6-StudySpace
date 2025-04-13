import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Remove the static spaceData array
// const spaceData = [ ... ];

// Helper function for formatting price (similar to SpaceManagement)
const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(Number(price))) {
    return 'N/A'; 
  }
  return `₱${Number(price).toFixed(2)}`;
};


export const SpaceShowcase = () => {
  // Add state variables
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch spaces data on component mount
  useEffect(() => {
    const fetchSpaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use the correct API endpoint (adjust if necessary)
        const response = await fetch('/api/space/getAll'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Optionally limit the number of spaces for the showcase, e.g., data.slice(0, 6)
        setSpaces(data); 
      } catch (e) {
        console.error("Failed to fetch spaces:", e);
        setError("Failed to load spaces. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpaces();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <section className="px-12 py-8 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-poppins">Featured Spaces</h2>
        <Link to="/spaces" className="text-blue-600 hover:text-blue-800 font-poppins">See all</Link>
      </div>

      {/* Handle Loading State */}
      {isLoading && <div className="text-center text-gray-500 py-4">Loading spaces...</div>}

      {/* Handle Error State */}
      {error && <div className="text-center text-red-500 py-4">{error}</div>}

      {/* Render spaces only if not loading and no error */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 px-4"> {/* Responsive grid */}
          {/* Map over the fetched spaces state */}
          {spaces.length > 0 ? (
            spaces.map(space => (
              // Use space.id as key
              <div key={space.id} className="rounded-3xl overflow-hidden shadow-md transform transition-transform hover:scale-105">
                {/* Image - Use uploads path and check for imageFilename */}
                {space.imageFilename ? (
                  <img 
                    src={`/uploads/${space.imageFilename}`} // Use dynamic path
                    alt={space.name} // Use space name for alt text
                    className="w-full h-80 object-cover" // Fixed height for consistency
                  />
                ) : (
                  <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
                {/* Content */}
                <div className="p-4"> {/* Adjusted padding */}
                  {/* Display space name */}
                  <h3 className="text-xl font-semibold mb-1 font-poppins truncate">{space.name}</h3> 
                  {/* Display location */}
                  <p className="text-gray-600 text-base mb-2 font-poppins">{space.location}</p> 
                  {/* Display formatted price */}
                  <p className="text-lg font-semibold text-[#2F9FE5] font-poppins">{formatPrice(space.price)} / hour</p> 
                  {/* Optional: Add a link/button to view details */}
                  {/* <Link to={`/space/${space.id}`} className="text-blue-500 hover:underline mt-2 inline-block">View Details</Link> */}
                </div>
              </div>
            ))
          ) : (
            // Handle case where no spaces are returned
            <p className="text-center text-gray-500 col-span-full py-4">No spaces found.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default SpaceShowcase;