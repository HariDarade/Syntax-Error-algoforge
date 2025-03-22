import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireHospital?: boolean; // Add new prop for hospital users
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireHospital = false, // Default to false
}) => {
  const { isAuthenticated, isAdmin, isHospital, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // If admin access is required but user is not an admin
    // Redirect to the appropriate dashboard based on user role
    if (isHospital) {
      return <Navigate to="/hospital-dashboard" replace />;
    }
    return <Navigate to="/patient-dashboard" replace />;
  }

  if (requireHospital && !isHospital) {
    // If hospital access is required but user is not a hospital
    // Redirect to the appropriate dashboard based on user role
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/patient-dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;