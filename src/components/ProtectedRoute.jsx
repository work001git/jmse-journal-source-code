// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, staffOnly = false, userOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-400">Verifying Portal Access...</p>
      </div>
    );
  }

  // Not logged in -> send to corresponding portal login
  if (!user) {
    if (adminOnly) return <Navigate to="/admin/login" state={{ from: location }} replace />;
    if (staffOnly) return <Navigate to="/staff/login" state={{ from: location }} replace />;
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role: ADMIN
  if (user.role === 'admin') {
    return children; // Admin can access everything
  }

  // Admin-only route accessed by non-admin
  if (adminOnly && user.role !== 'admin') {
    if (user.role === 'staff') {
      return <Navigate to="/staff" replace />;
    }
    return <Navigate to="/my-submissions" replace />;
  }

  // Staff-only route accessed by non-staff (and non-admin)
  if (staffOnly && user.role !== 'staff') {
    return <Navigate to="/staff/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
