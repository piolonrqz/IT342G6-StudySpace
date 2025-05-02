import React, { useState, useEffect } from "react";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/Components/ui/button";
import { format } from "date-fns";
import { ConfirmationModal } from "@/Components/ConfirmationModal";
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
    const { user, token, isAuthenticated, logout } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelBookingId, setCancelBookingId] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('Booked'); // Set default filter to 'Booked'

    // Fetch user's bookings
    useEffect(() => {
        const fetchBookings = async () => {
            if (!isAuthenticated || !user) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://it342g6-studyspace.onrender.com/api/bookings/user/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        console.error("Authentication failed. Token might be invalid or expired. Logging out.");
                        toast({
                            title: "Authentication Required",
                            description: "Your session has expired. Please log in again.",
                            variant: "destructive",
                        });
                        logout();
                        navigate('/LoginPage');
                        return;
                    }
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                
                // Process bookings to update display status for completed bookings
                const processedData = data.map(booking => {
                    // If a booking is BOOKED and its end time is in the past, display it as COMPLETED
                    if (booking.status === 'BOOKED' && booking.endTime && new Date(booking.endTime) < new Date()) {
                        return { ...booking, displayStatus: 'COMPLETED' };
                    }
                    // Otherwise, use the actual status
                    return { ...booking, displayStatus: booking.status };
                });
                
                setBookings(processedData);

            } catch (err) {
                console.error("Failed to fetch bookings:", err);
                const errorMsg = err.message.includes('HTTP error') 
                    ? `Failed to load your bookings. ${err.message}. Please try again later.`
                    : "Failed to load your bookings. Please try again later.";
                setError(errorMsg);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [isAuthenticated, user, token, logout, navigate, toast]);

    // Handle booking cancellation
    const handleCancelBooking = async (reason) => {
        if (!cancelBookingId) return;
        
        try {
            const response = await fetch(`https://it342g6-studyspace.onrender.com/api/bookings/${cancelBookingId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to cancel booking: ${response.status} ${response.statusText}. ${errorData}`);
            }

            // Update the local state to reflect the cancellation
            setBookings(bookings.map(booking => 
                booking.id === cancelBookingId 
                    ? { ...booking, status: 'CANCELLED', cancellationReason: reason } 
                    : booking
            ));

            toast({
                title: "Booking cancelled",
                description: "Your booking has been successfully cancelled.",
            });
        } catch (err) {
            console.error("Error cancelling booking:", err);
            toast({
                title: "Cancellation failed",
                description: err.message || "Failed to cancel your booking. Please try again.",
                variant: "destructive"
            });
        } finally {
            setCancelBookingId(null);
            setIsConfirmModalOpen(false);
        }
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return format(date, 'MMM dd, yyyy');
        } catch (error) {
            console.error("Date formatting error:", error);
            return dateString || 'N/A';
        }
    };

    // Helper function to format time
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

    // Get status badge styling
    const getStatusBadgeClass = (status) => {
        if (!status) return "bg-gray-200 text-gray-800";
        
        switch (status.toUpperCase()) {
            case 'BOOKED': // Changed from CONFIRMED/PENDING
                return "bg-blue-100 text-blue-800"; // Representing BOOKED as 'Upcoming' or similar
            case 'CANCELLED':
                return "bg-red-100 text-red-800";
            case 'COMPLETED':
                return "bg-green-100 text-green-800"; // Changed to green to distinguish completed bookings
            default:
                return "bg-gray-200 text-gray-800";
        }
    };

    // Filter options - Removed 'All'
    const filterOptions = ['Booked', 'Cancelled', 'Completed'];

    // Filtered bookings based on active filter - dynamically check completion status
    const filteredBookings = bookings.filter(booking => {
        let effectiveStatus = booking.status; // Start with the actual status

        // Dynamically determine if a 'BOOKED' booking is now 'COMPLETED'
        if (booking.status === 'BOOKED' && booking.endTime && new Date(booking.endTime) < new Date()) {
            effectiveStatus = 'COMPLETED';
        }

        // Filter based on the effective status matching the active filter
        return effectiveStatus?.toUpperCase() === activeFilter.toUpperCase();
    });

    // Dynamically determine the display status for the badge inside the map function
    const getDisplayStatus = (booking) => {
        if (booking.status === 'BOOKED' && booking.endTime && new Date(booking.endTime) < new Date()) {
            return 'COMPLETED';
        }
        return booking.status;
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavigationBar />
            
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 font-poppins">My Bookings</h1>

                {/* Filter Buttons */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {filterOptions.map(filter => (
                        <Button
                            key={filter}
                            variant={activeFilter === filter ? "default" : "outline"}
                            onClick={() => setActiveFilter(filter)}
                            className="capitalize"
                        >
                            {filter === 'Booked' ? 'Upcoming' : filter} {/* Display 'Booked' as 'Upcoming' */}
                        </Button>
                    ))}
                </div>
                
                {!isAuthenticated && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-6">
                        <p className="font-medium">Please log in to view your bookings.</p>
                    </div>
                )}
                
                {isLoading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading your bookings...</p>
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
                        <p className="font-medium">{error}</p>
                    </div>
                )}
                
                {isAuthenticated && !isLoading && !error && (
                    <>
                        {filteredBookings.length === 0 ? ( 
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
                                <p className="text-gray-600 mb-4">
                                    {/* Updated message for empty state */}
                                    {`You don't have any ${activeFilter.toLowerCase()} bookings.`}
                                </p>
                                <Button variant="outline" asChild>
                                    <a href="/SpacesPage">Browse Spaces</a>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredBookings.map(booking => { // Use filteredBookings here
                                    const spaceId = booking.spaceId;
                                    const spaceName = booking.spaceName;
                                    const spaceLocation = booking.spaceLocation;
                                    const spaceImageFilename = booking.spaceImageFilename;

                                    const isPast = booking.endTime ? new Date(booking.endTime) < new Date() : false;
                                    const canCancel = booking.status?.toUpperCase() === 'BOOKED' && !isPast;
                                    
                                    // Use getDisplayStatus for the badge
                                    const displayStatus = getDisplayStatus(booking); 
                                    
                                    return (
                                        <div key={booking.id} className="border rounded-lg overflow-hidden shadow-sm">
                                            <div className="md:flex">
                                                {/* Space Image */}
                                                <div className="md:w-1/4 h-48 md:h-auto relative">
                                                    {spaceImageFilename ? (
                                                        <img
                                                            src={spaceImageFilename} 
                                                            alt="Space"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Booking Details */}
                                                <div className="p-6 md:w-3/4">
                                                    <div className="flex flex-wrap justify-between items-start mb-4">
                                                        <div>
                                                            <h2 className="text-xl font-semibold mb-1 font-poppins">
                                                                {spaceName || 'Space Details Unavailable'}
                                                            </h2>
                                                            <p className="text-gray-600 font-poppins">
                                                                {spaceLocation || 'Location Unavailable'}
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(displayStatus)}`}>
                                                            {displayStatus || 'Status Unavailable'} {/* Use dynamic displayStatus */}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-1">Date</p>
                                                            <p className="font-medium">{formatDate(booking.startTime)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-1">Time</p>
                                                            <p className="font-medium">
                                                                {booking.startTime ? format(new Date(booking.startTime), 'h:mm a') : 'N/A'} - {booking.endTime ? format(new Date(booking.endTime), 'h:mm a') : 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-1">Participants</p>
                                                            <p className="font-medium">{booking.numberOfPeople || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-1">Total Price</p>
                                                            <p className="font-medium">₱{booking.totalPrice?.toFixed(2) || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex justify-end">
                                                        <Button
                                                            variant="outline"
                                                            className="mr-2"
                                                            asChild
                                                            disabled={!spaceId}
                                                        >
                                                            <a href={spaceId ? `/space/${spaceId}` : '#'}>View Space</a>
                                                        </Button>
                                                        
                                                        {canCancel && (
                                                            <Button 
                                                                variant="destructive" 
                                                                onClick={() => {
                                                                    setCancelBookingId(booking.id);
                                                                    setIsConfirmModalOpen(true);
                                                                }}
                                                            >
                                                                Cancel Booking
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </main>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleCancelBooking}
                title="Confirm Cancellation"
                description="Are you sure you want to cancel this booking? This action cannot be undone."
                showReasonField={true}
                reasonLabel="Cancellation Reason (optional)"
            />

            <Footer />
        </div>
    );
};

export default Bookings;