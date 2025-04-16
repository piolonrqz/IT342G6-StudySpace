import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";

// Helper function for formatting price
const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(Number(price))) {
      return 'N/A';
    }
    return `${Number(price).toFixed(2)}`; // Return only the number part for styling flexibility
};

// Helper function to format space type enum
const formatSpaceType = (type) => {
    if (!type) return 'N/A';
    return type
        .split('_') // Split by underscore
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter, lowercase rest
        .join(' '); // Join with space
};

// Helper function to format time string (HH:mm) to AM/PM
const formatTime = (timeString) => {
    if (!timeString || !/^\d{2}:\d{2}$/.test(timeString)) return 'N/A'; // Basic validation

    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert 0 or 12 hour to 12
    const formattedMinutes = minute < 10 ? `0${minute}` : minute; // Add leading zero to minutes

    return `${formattedHour}:${formattedMinutes} ${ampm}`;
};


const SpaceDetails = () => {
    const { id } = useParams();
    const [space, setSpace] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSpaceDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/space/${id}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Space with ID ${id} not found.`);
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSpace(data);
            } catch (e) {
                console.error("Failed to fetch space details:", e);
                setError(e.message || "Failed to load space details. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpaceDetails();
    }, [id]);

    // Format price only when space data is available
    const formattedPrice = space ? formatPrice(space.price) : 'N/A';

    // Format type and times only when space data is available
    const formattedSpaceType = space ? formatSpaceType(space.spaceType) : 'N/A';
    const formattedOpeningTime = space ? formatTime(space.openingTime) : 'N/A';
    const formattedClosingTime = space ? formatTime(space.closingTime) : 'N/A';


    return (
        <div className="flex flex-col min-h-screen">
            <NavigationBar />

            <main className="flex-grow">
                {isLoading && <div className="text-center text-gray-500 py-10">Loading space details...</div>}
                {error && <div className="text-center text-red-500 py-10">{error}</div>}

                {!isLoading && !error && space && (
                    // Reduce padding and font sizes
                    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10"> {/* Use container and standard padding */}
                        {/* Image */}
                        {space.imageFilename ? (
                            <img
                                src={`/uploads/${space.imageFilename}`}
                                alt={space.name}
                                className="w-full h-auto max-h-[700px] object-cover rounded-lg shadow-md mb-6 md:mb-8" /* Added max-height, adjusted margin */
                            />
                        ) : (
                            <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg shadow-md mb-6 md:mb-8">
                                No Image Available
                            </div>
                        )}

                        {/* Details and Booking Button */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 md:mt-8"> {/* Adjusted margin, flex direction for medium screens */}
                            <div className="flex flex-col gap-1 mb-4 md:mb-0"> {/* Reduced gap, added bottom margin for small screens */}
                                <h1 className="text-3xl md:text-3xl font-bold text-black font-poppins">{space.name}</h1> {/* Reduced size */}
                                <span className="text-xl md:text-1xl text-gray-600 font-poppins">{space.location}</span> {/* Reduced size */}
                                {/* Price */}
                                <div className="flex items-baseline gap-1.5 mt-1"> {/* Reduced gap, added top margin */}
                                    <span className="text-2xl md:text-1xl font-semibold text-sky-500 font-poppins"> {/* Reduced size, adjusted weight */}
                                        ₱{formattedPrice}
                                    </span>
                                    {formattedPrice !== 'N/A' && (
                                        <span className="text-base md:text-lg text-gray-500 font-poppins">/ hr</span> 
                                    )}
                                </div>
                            </div>

                            {/* Booking Button */}
                            <button
                                onClick={() => alert('Booking functionality to be implemented!')}
                                className="text-white shadow-md text-base md:text-lg font-medium cursor-pointer bg-sky-500 px-6 py-2.5 rounded-md hover:bg-sky-600 transition-colors font-poppins w-full md:w-auto" /* Adjusted size, padding, added width control */
                            >
                                Book Now
                            </button>
                        </div>

                        {/* Description */}
                        <div className="mt-6 md:mt-8 border-t pt-6 md:pt-8"> {/* Added border-top and padding */}
                             <h2 className="text-2xl font-semibold mb-3 font-poppins">Description</h2> {/* Added heading */}
                             <p className="text-base md:text-lg text-gray-700 leading-relaxed font-poppins">{space.description}</p> {/* Reduced size */}
                        </div>

                         {/* Optional: Add other details like capacity, type, hours */}
                         <div className="mt-6 text-base md:text-lg text-gray-700 space-y-1 font-poppins"> {/* Reduced size/spacing */}
                             <p><strong>Capacity:</strong> {space.capacity}</p>
                             {/* Use the formatted space type */}
                             <p><strong>Type:</strong> {formattedSpaceType}</p>
                             {/* Display formatted opening and closing times separately */}
                             <p><strong>Opening Time:</strong> {formattedOpeningTime}</p>
                             <p><strong>Closing Time:</strong> {formattedClosingTime}</p>
                         </div>
                    </section>
                )}
                 {!isLoading && !error && !space && (
                     <div className="text-center text-gray-500 py-10">Space details could not be loaded.</div>
                 )}
            </main>

            <Footer />
        </div>
    );
};

export default SpaceDetails;