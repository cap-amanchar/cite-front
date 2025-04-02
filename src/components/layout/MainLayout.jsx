// src/components/layout/MainLayout.jsx
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const MainLayout = ({ children }) => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Header
                toggleSidebar={toggleSidebar}
                sidebarOpen={sidebarOpen}
            />

            <div className="flex flex-1 h-[calc(100vh-64px)]">
                {/* Sidebar - fixed position */}
                <aside
                    className={`fixed top-16 h-[calc(100vh-64px)] w-64 bg-white border-r-4 border-black transition-transform duration-300 z-10 ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <Sidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        userRole={user?.role}
                    />
                </aside>

                {/* Main Content - with left margin for sidebar */}
                <main
                    className={`flex-1 p-6 transition-all duration-300 ${
                        sidebarOpen ? 'ml-64' : 'ml-0'
                    }`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;