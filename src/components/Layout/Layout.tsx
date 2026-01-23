import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.scss';

const Layout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleMenuToggle = () => {
        setSidebarOpen((prev) => !prev);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="layout" dir="rtl">
            {/* Header with menu toggle */}
            <Header
                onMenuToggle={handleMenuToggle}
                isMenuOpen={sidebarOpen}
            />

            {/* Sidebar connected to state */}
            <Sidebar
                open={sidebarOpen}
                onClose={handleSidebarClose}
            />

            {/* Main content area */}
            <main className="layout__main">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;