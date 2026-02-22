// ==========================================================================
// ProtectedRoute.tsx
// Wraps any route that requires admin authentication.
// Redirects to /admin/login if not authenticated.
// ==========================================================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/Auth/AuthContext'; // adjust path

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // While Firebase checks auth state, show a spinner
    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#f5f5f5',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // Not logged in → redirect to login, remembering where they came from
    if (!user) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;