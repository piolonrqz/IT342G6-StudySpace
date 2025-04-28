import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

// Helper function to get initials
const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName[0].toUpperCase() : '';
    const lastInitial = lastName ? lastName[0].toUpperCase() : '';
    return `${firstInitial}${lastInitial}` || '?'; // Return '?' if no names
};

export const NavigationBar = () => {
    const { user, logout, isAuthenticated } = useAuth(); // Get user and logout from context
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref for detecting clicks outside
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false); // State to track image loading error

    const handleLogout = () => {
        logout(); // Call logout from context
        setIsDropdownOpen(false); // Close dropdown after logout
        // Navigation is handled within the logout function in AuthContext
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    // Reset image error state when user or specific filename changes
    useEffect(() => {
        setImgError(false);
    }, [user?.profilePictureFilename]); // Depend specifically on the filename


    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm relative"> {/* Added relative positioning */}
            {/* Logo and Brand Name */}
            <Link to="/" className="flex items-center"> {/* Make logo clickable */}
                <img src="/logo.png" alt="StudySpace" className="h-8" />
                <span className="ml-2 text-xl font-semibold text-sky-500 font-poppins">StudySpace</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6"> {/* Hide on small screens */}
                <Link to="/" className="text-gray-900 hover:text-sky-600 font-poppins">Home</Link>
                <Link to="/SpacesPage" className="text-gray-900 hover:text-sky-600 font-poppins">Spaces</Link>
                <Link to="/WhyStudySpace" className="text-gray-900 hover:text-sky-600 font-poppins">Why StudySpace</Link>
                <Link to="/Bookings" className="text-gray-900 hover:text-sky-600 font-poppins">Bookings</Link>

            </div>

            {/* Auth Buttons / User Dropdown */}
            <div className="flex items-center space-x-4">
                {isAuthenticated && user ? (
                    // User Dropdown
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center justify-center w-10 h-10 bg-sky-500 text-white rounded-full font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 overflow-hidden" // Added overflow-hidden
                            aria-label="User menu"
                            aria-haspopup="true"
                            aria-expanded={isDropdownOpen}
                        >
                            {user.profilePictureFilename && !imgError ? (
                                <img
                                    key={user.profilePictureFilename}
                                    src={user.profilePictureFilename}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={() => {
                                        console.error("[NavigationBar] Image onError triggered for:", user.profilePictureFilename);
                                        setImgError(true);
                                    }}
                                />
                            ) : (
                                // For Google users, we could potentially use the Google profile picture
                                // or we just use initials as the fallback
                                getInitials(user.firstName, user.lastName)
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                    Signed in as <br />
                                    <span className="font-medium">{user.firstName} {user.lastName}</span>
                                    {user.role === 'ADMIN' && <span className="text-xs text-sky-600 block">(Admin)</span>} {/* Optional: Indicate Admin role */}
                                </div>
                                {/* Conditional Link: Admin or Profile */}
                                {user.role === 'ADMIN' ? (
                                    <Link
                                        to="/AdminPage" // Link to Admin Page for admins
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Admin Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        to="/profile" // Link to Profile for regular users
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Profile
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Login/Register Buttons
                    <>
                        <Link to="/LoginPage" className="px-4 py-2 font-medium text-sky-500 border border-sky-500 rounded hover:bg-sky-50 font-poppins">Log in</Link>
                        <Link to="/RegisterPage" className="px-4 py-2 font-medium text-white bg-sky-500 rounded hover:bg-sky-600 font-poppins">Register</Link>
                    </>
                )}
            </div>
             {/* Optional: Add a Mobile Menu Button here for smaller screens */}
        </nav>
    );
};
export default NavigationBar;