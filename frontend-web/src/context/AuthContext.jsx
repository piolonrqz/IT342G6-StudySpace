import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user object { id, firstName, lastName, email, role }
    const [token, setToken] = useState(localStorage.getItem('jwtToken'));
    const navigate = useNavigate();

    // Effect to load user data from localStorage on initial render
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        const storedUser = localStorage.getItem('currentUser');
        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing stored user data:", error);
                // Clear invalid stored data
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('currentUser');
                setToken(null);
                setUser(null);
            }
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // Login function
    const login = (userData, jwtToken) => {
        // Construct user object based on backend response and LoginForm logic
        const currentUser = {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email, // Assuming email is needed/available
            role: userData.role || 'USER', // Default role if not provided
            profilePictureFilename: userData.profilePictureFilename, // Add profile picture filename
            phoneNumber: userData.phoneNumber
        };

        localStorage.setItem('jwtToken', jwtToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        setToken(jwtToken);
        setUser(currentUser);

        // Redirect after login (optional, can also be handled in LoginForm)
        // if (currentUser.role === 'ADMIN') {
        //     navigate("/AdminPage");
        // } else {
        //     navigate("/");
        // }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('currentUser');
        setToken(null);
        setUser(null);
        navigate('/'); // Redirect to home page after logout
    };

    // Update user function
    const updateUser = async (userData, profilePictureFile) => {
        if (!user || !token) {
            console.error("Cannot update user: Not logged in.");
            throw new Error("You must be logged in to update your profile.");
        }

        const formData = new FormData();

        // Append user data DTO as a JSON string blob
        // Backend expects a part named "userData"
        formData.append('userData', new Blob([JSON.stringify({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            role: userData.role
        })], { type: 'application/json' }));

        // Append the profile picture file if selected
        // Backend expects a part named "profilePictureFile"
        if (profilePictureFile) {
            formData.append('profilePictureFile', profilePictureFile);
        }

        try {
            // Update URL to use production URL
            const response = await fetch(`http://localhost:8080/api/users/update/${user.id}`, { 
                method: 'PUT',
                headers: {
                    // Content-Type is set automatically by the browser for FormData
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                let errorMessage = `Failed to update user: ${response.status}`; // Default message
                let errorData = null;
                try {
                    // Try parsing JSON first
                    errorData = await response.json();
                    // Use the specific error from JSON if available
                    errorMessage = `${errorData.message || errorData.error || response.status}`;
                    console.error('Failed to update user (JSON):', response.status, errorData);
                } catch (jsonError) {
                    // If JSON parsing fails, try reading as text (response body might not be JSON)
                    try {
                        // Note: response.text() might fail if response.json() already consumed the body partially on some browsers/errors
                        // It's safer to rely on the status code if JSON parsing fails.
                        const errorText = await response.text(); 
                        errorMessage = `${response.status} - ${errorText || 'Unknown error'}`;
                        console.error('Failed to update user (Text):', response.status, errorText);
                    } catch (textError) {
                        // If reading text also fails, stick to the status code
                        errorMessage = `${response.status} - Unknown error`;
                        console.error('Failed to update user (Status only):', response.status);
                    }
                }
                // Throw the determined error message once
                throw new Error(errorMessage);
            }

            // Parse the successful response
            let updatedUserData;
            try {
                updatedUserData = await response.json();
            } catch (parseError) {
                console.error('Error parsing success response:', parseError);
                // If we can't parse the response, just use existing user data with updated form data
                updatedUserData = {
                    ...user,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    role: userData.role
                };
            }

            // Construct the updated user object for local state
            const updatedUser = {
                ...user, // Keep existing fields like id, role (unless updated)
                firstName: updatedUserData.firstName || userData.firstName,
                lastName: updatedUserData.lastName || userData.lastName,
                email: updatedUserData.email || userData.email,
                phoneNumber: updatedUserData.phoneNumber || userData.phoneNumber,
                // Update role if it's returned, otherwise keep existing
                role: updatedUserData.role ? updatedUserData.role.toUpperCase() : user.role, 
                profilePictureFilename: updatedUserData.profilePictureFilename || user.profilePictureFilename, // Update filename if returned
            };

            // Update state and localStorage
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            return updatedUser; // Return the updated user object

        } catch (error) {
            console.error('Error updating user:', error);
            // Ensure the error thrown has a meaningful message for the UI
            throw new Error(error.message || 'An unexpected error occurred while updating the profile.'); 
        }
    };

    // Change Password function
    const changePassword = async (passwordData) => {
        if (!user || !token) {
            console.error("Cannot change password: Not logged in.");
            throw new Error("You must be logged in to change your password."); // Throw error to be caught by caller
        }

        try {
            const response = await fetch(`https://it342g6-studyspace.onrender.com/api/users/change-password/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(passwordData), // Send { currentPassword, newPassword }
            });

            if (!response.ok) {
                // First try to parse as JSON, but handle non-JSON responses gracefully
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.error || errorData.message || `Failed to change password: ${response.status}`);
                } catch (parseError) {
                    // If JSON parsing fails, use response text or status
                    const errorText = await response.text().catch(() => "Unknown error");
                    throw new Error(`Failed to change password: ${response.status} - ${errorText || 'Unknown error'}`);
                }
            }

            // Try to parse the response as JSON
            try {
                const result = await response.json();
                return result; // Return success message or data
            } catch (parseError) {
                // If parsing fails but the request was successful, just return a success message
                return { message: "Password changed successfully" };
            }

        } catch (error) {
            // Re-throw the error so the calling component can handle it (e.g., show toast)
            throw error;
        }
    };

    // Value provided by the context
    const value = {
        user,
        token,
        login,
        logout,
        updateUser,
        changePassword, // Add changePassword to the context value
        isAuthenticated: !!token && !!user // Helper boolean flag
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};