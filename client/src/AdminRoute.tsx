import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import isAdmin from '@/utils/isAdmin';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return null;
    
    // Temporarily bypass for testing - remove in production
    if (process.env.NODE_ENV === 'development') {
        return <>{children}</>;
    }
    
    if (!isAuthenticated || !isAdmin(user?.role)) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

export default AdminRoute;