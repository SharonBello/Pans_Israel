import React from 'react';
import { Button } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/Auth/AuthContext'; // adjust path

const AdminLogoutButton: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login', { replace: true });
    };

    return (
        <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<LogoutOutlined />}
            onClick={handleLogout}
            sx={{ borderRadius: 2 }}
        >
            התנתקות
        </Button>
    );
};

export default AdminLogoutButton;