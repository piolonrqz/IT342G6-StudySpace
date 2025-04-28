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
            profilePictureFilename: userData.profilePictureFilename // Add profile picture filename
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
            // Handle not logged in state, maybe redirect to login
            return;
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
            // Correct endpoint: /api/users/update/{id}
            const response = await fetch(`http://localhost:8080/api/users/update/${user.id}`, { 
                method: 'PUT',
                headers: {
                    // Content-Type is set automatically by the browser for FormData
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to update user:', response.status, errorData);
                // Handle specific errors (e.g., display message to user)
                throw new Error(`Failed to update user: ${errorData.message || response.status}`);
            }

            const updatedUserData = await response.json();

            // Construct the updated user object for local state
            const updatedUser = {
                ...user, // Keep existing fields like id, role (unless updated)
                firstName: updatedUserData.firstName,
                lastName: updatedUserData.lastName,
                email: updatedUserData.email,
                phoneNumber: updatedUserData.phoneNumber,
                // Update role if it's returned, otherwise keep existing
                role: updatedUserData.role ? updatedUserData.role.toUpperCase() : user.role, 
                profilePictureFilename: updatedUserData.profilePictureFilename || user.profilePictureFilename, // Update filename if returned
            };


            // Update state and localStorage
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));


        } catch (error) {
            console.error('Error updating user:', error);
        }
    };


    // Value provided by the context
    const value = {
        user,
        token,
        login,
        logout,
        updateUser, // Add updateUser to the context value
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