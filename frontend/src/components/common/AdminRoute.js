import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Loader from './Loader';

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!isAdmin()) {
    // If user is not an admin, redirect to home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;