import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './Layout';

const ProtectedRoute = ({ role }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (role && user?.role !== role) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user?.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute; 