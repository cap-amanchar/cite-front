// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Header = ({ toggleSidebar, sidebarOpen }) => {
    const { user, logout } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();

    // Fetch unread notifications count
    useEffect(() => {
        if (user) {
            // This would be replaced with a real API call
            // For now, just simulate unread notifications
            setUnreadCount(3);
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <header className="sticky top-0 z-30 border-b-4 border-black bg-yellow-400">
            <div className="container flex items-center justify-between h-16 px-4 mx-auto">
                {/* Menu toggle and logo */}
                <div className="flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 mr-4 text-black lg:hidden hover:opacity-70"
                        aria-label={sidebarOpen ? 'Close Menu' : 'Open Menu'}
                    >
                        {sidebarOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>

                    <Link href="/dashboard" className="text-xl font-bold text-black">
                        Absence Manager
                    </Link>
                </div>

                {/* Right side actions */}
                {user ? (
                    <div className="flex items-center">
                        {/* Notifications */}
                        <div className="relative mr-4">
                            <Link href="/notifications">
                                <button className="p-2 hover:opacity-70">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-black rounded-full">
                      {unreadCount}
                    </span>
                                    )}
                                </button>
                            </Link>
                        </div>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center hover:opacity-70"
                                aria-expanded={dropdownOpen}
                            >
                <span className="hidden mr-2 font-bold md:block">
                  {user.fullName || user.username}
                </span>
                                <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-gray-800 border-2 border-black rounded-full">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                                </div>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 z-10 pt-2">
                                    <div className="w-48 py-2 font-bold bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <div className="px-4 py-2 border-b-2 border-black">
                                            <p>{user.fullName || user.username}</p>
                                            <p className="text-sm font-normal text-gray-600">
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <Link href="/login">
                            <Button variant="secondary" size="sm">Login</Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;