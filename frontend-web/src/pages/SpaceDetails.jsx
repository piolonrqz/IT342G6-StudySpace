import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";
import BookingModal from "../Components/BookingModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";

// Helper function for formatting price
const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(Number(price))) {
      return 'N/A';
    }
    return `₱${Number(price).toFixed(2)}`;
};


// Helper function to format space type enum
const formatSpaceType = (type) => {
    if (!type) return 'N/A';
    return type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

// Helper function to format time string (HH:mm) to AM/PM
const formatTime = (timeString) => {
    if (!timeString || !/^\d{2}:\d{2}$/.test(timeString)) return 'N/A';

    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedMinutes = minute < 10 ? `0${minute}` : minute;

    return `${formattedHour}:${formattedMinutes} ${ampm}`;
};


const SpaceDetails = () => {
    const { id } = useParams();
    const [space, setSpace] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const fetchSpaceDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/space/${id}`); // Use environment variable
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Space with ID ${id} not found.`);
                    }
                    // Try to get more specific error from backend
                    let errorMsg = `HTTP error! status: ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMsg = errorData.message || errorData.error || errorMsg;
                    } catch (parseError) {
                        // Ignore if response is not JSON
                    }
                    throw new Error(errorMsg);
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

        // Only fetch if id is defined and not the string "undefined"
        if (id && id !== 'undefined') {
            fetchSpaceDetails();
        } else {
            // Handle the case where id is missing or invalid early
            setError("Invalid or missing Space ID.");
            setIsLoading(false);
            console.error("Attempted to fetch with invalid ID:", id);
        }
    }, [id]);

    // Format price only when space data is available
    const formattedPrice = space ? formatPrice(space.price) : 'N/A';
    const formattedSpaceType = space ? formatSpaceType(space.spaceType) : 'N/A';
    const formattedOpeningTime = space ? formatTime(space.openingTime) : 'N/A';
    const formattedClosingTime = space ? formatTime(space.closingTime) : 'N/A';

    const handleBookNowClick = () => {
        if (!isAuthenticated) {
            toast({
                title: "Authentication required",
                description: "Please log in to book a space.",
                variant: "destructive"
            });
            return;
        }
        // Check if user is ADMIN before opening modal (redundant if button is disabled, but good practice)
        if (user?.role === 'ADMIN') {
             toast({
                 title: "Action Not Allowed",
                 description: "Administrators cannot book spaces.",
                 variant: "destructive"
             });
             return;
        }
        setIsBookingModalOpen(true);
    };

    // Determine if the button should be disabled
    const isAdmin = user?.role === 'ADMIN';

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <NavigationBar />

            <main className="flex-grow">
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-500 font-poppins">Loading space details...</p>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="max-w-md mx-auto my-12 p-6 bg-red-50 rounded-lg border border-red-200 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-red-700 mb-2 font-poppins">Error Loading Space</h3>
                        <p className="text-red-600 font-poppins">{error}</p>
                    </div>
                )}

                {!isLoading && !error && space && (
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            {/* Hero Image Section */}
                            <div className="relative h-80 sm:h-96 md:h-[400px] lg:h-[500px] overflow-hidden">
                                {space.imageFilename ? (
                                    <img
                                        src={space.imageFilename}
                                        alt={space.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>No Image Available</span>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Space Type Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center px-3 py-1.5 bg-sky-100 text-sky-800 rounded-full text-sm font-medium font-poppins">
                                        {formattedSpaceType}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Content Section */}
                            <div className="p-6 md:p-8">
                                {/* Header with Title, Location and Booking Button */}
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8">
                                    <div className="space-y-3">
                                        <h1 className="text-3xl font-bold text-gray-800 font-poppins">{space.name}</h1>
                                        <div className="flex items-center text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p className="font-poppins">{space.location}</p>
                                        </div>
                                        
                                        {/* Price */}
                                        <div className="flex items-center">
                                            <div className="flex items-center text-2xl font-semibold text-sky-500 font-poppins">
                                                <span>{formattedPrice}</span>
                                                {formattedPrice !== 'N/A' && (
                                                    <span className="text-base text-gray-500 ml-1">/ hour</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Booking Button */}
                                    <div className="w-full md:w-auto">
                                        <button
                                            onClick={handleBookNowClick}
                                            disabled={isAdmin}
                                            className={`text-white shadow-md text-base font-medium rounded-lg px-8 py-3 transition-all w-full md:w-auto font-poppins
                                            ${isAdmin 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-sky-500 hover:bg-sky-600 hover:shadow-lg transform hover:-translate-y-0.5'}`}
                                        >
                                            {isAdmin ? 'Admin Cannot Book' : 'Book Now'}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Key Info Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                    <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <span className="text-sm text-gray-500 font-poppins">Capacity</span>
                                        <span className="text-xl font-semibold text-gray-800 font-poppins">{space.capacity}</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm text-gray-500 font-poppins">Opening Time</span>
                                        <span className="text-xl font-semibold text-gray-800 font-poppins">{formattedOpeningTime}</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                        <span className="text-sm text-gray-500 font-poppins">Closing Time</span>
                                        <span className="text-xl font-semibold text-gray-800 font-poppins">{formattedClosingTime}</span>
                                    </div>
                                </div>
                                
                                {/* Description */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-poppins">Description</h2>
                                    <div className="prose max-w-none text-gray-700 font-poppins">
                                        <p className="leading-relaxed">{space.description || "No description available for this space."}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {!isLoading && !error && !space && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2 font-poppins">Space Not Found</h2>
                        <p className="text-gray-500 font-poppins">The space details could not be loaded.</p>
                    </div>
                )}
            </main>

            {/* Booking Modal */}
            {space && (
                <BookingModal 
                    isOpen={isBookingModalOpen} 
                    onClose={() => setIsBookingModalOpen(false)} 
                    space={space} 
                />
            )}

            <Footer />
        </div>
    );
};

export default SpaceDetails;