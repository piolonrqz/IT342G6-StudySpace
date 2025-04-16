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
        navigate('/LoginPage'); // Redirect to login page after logout
    };

    // Value provided by the context
    const value = {
        user,
        token,
        login,
        logout,
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