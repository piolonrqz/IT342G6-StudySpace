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
              // Wrap the entire card div with a Link component
              <Link key={space.id} to={`/space/${space.id}`} className="block rounded-3xl overflow-hidden shadow-md transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"> {/* Added Link and focus styles */}
                {/* The existing card content goes inside the Link */}
                <div> {/* Optional: Keep an inner div if needed, or apply styles directly to Link if it behaves like a block */}
                  {/* Image */}
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
                  {/* Content */}
                  <div className="p-4 bg-white"> {/* Ensure content background is white if needed */}
                    <h3 className="text-xl font-semibold mb-1 font-poppins truncate">{space.name}</h3>
                    <p className="text-gray-600 text-base mb-2 font-poppins">{space.location}</p>
                    <p className="text-lg font-semibold text-[#2F9FE5] font-poppins">{formatPrice(space.price)} / hour</p>
                    {/* You can remove the specific "View Details" link now if the whole card is clickable */}
                    {/* <Link to={`/space/${space.id}`} className="text-blue-500 hover:underline mt-2 inline-block">View Details</Link> */}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full py-4">No spaces found.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default SpaceShowcase;