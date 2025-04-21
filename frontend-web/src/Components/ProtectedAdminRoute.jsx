import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Import useAuth

const ProtectedAdminRoute = ({ children }) => { // Accept children prop
  const { user, isAuthenticated } = useAuth(); // Get user from context

  console.log("ProtectedAdminRoute: Checking auth state...");
  console.log("ProtectedAdminRoute: isAuthenticated:", isAuthenticated);

  // Check if authenticated and if the user role is ADMIN
  const isAdmin = isAuthenticated && user && user.role === 'ADMIN';
  console.log("ProtectedAdminRoute: isAdmin:", isAdmin);

  if (!isAuthenticated) {
    console.log("ProtectedAdminRoute: Not authenticated, redirecting to /LoginPage");
    // Redirect to login if not authenticated at all
    return <Navigate to="/LoginPage" replace />;
  }

  if (!isAdmin) {
    console.log("ProtectedAdminRoute: Not an admin, redirecting to /"); // Or a specific unauthorized page
    // Redirect to home or an unauthorized page if authenticated but not admin
    return <Navigate to="/" replace />;
  }

  // If authenticated and is admin, render the child component passed via props or Outlet
  console.log("ProtectedAdminRoute: Access granted, rendering children/Outlet.");
  return children ? children : <Outlet />; // Render children if provided, otherwise Outlet
};

export default ProtectedAdminRoute;