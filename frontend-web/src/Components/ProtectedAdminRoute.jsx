import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const isAdmin = currentUser && currentUser.role === 'Admin';

  return isAdmin ? <Outlet /> : <Navigate to="/404" replace />;
};

export default ProtectedAdminRoute;