// src/components/layout/Sidebar.jsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = ({ isOpen, onClose, userRole }) => {
    const router = useRouter();

    // Menu items for each role
    const adminMenuItems = [
        { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { href: '/absences/board', label: 'Absence Board', icon: 'board' },
        { href: '/absences', label: 'Absences', icon: 'absence' },
        { href: '/users', label: 'Users', icon: 'users' },
        { href: '/departments', label: 'Departments', icon: 'department' },
        { href: '/leave-balances', label: 'Leave Balances', icon: 'balance' },
        { href: '/reports/team', label: 'Reports', icon: 'report' },
    ];

    const managerMenuItems = [
        { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { href: '/absences/board', label: 'Absence Board', icon: 'board' },
        { href: '/absences', label: 'Absences', icon: 'absence' },
        { href: '/leave-balances', label: 'Team Balances', icon: 'balance' },
        { href: '/reports/team', label: 'Team Reports', icon: 'report' },
    ];

    const employeeMenuItems = [
        { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { href: '/absences', label: 'My Absences', icon: 'absence' },
        { href: '/absences/new', label: 'Request Absence', icon: 'new' },
        { href: '/leave-balances', label: 'My Balance', icon: 'balance' },
    ];

    // Get the appropriate menu items based on user role
    const getMenuItems = () => {
        switch (userRole) {
            case 'admin':
                return adminMenuItems;
            case 'manager':
                return managerMenuItems;
            case 'employee':
                return employeeMenuItems;
            default:
                return [];
        }
    };

    // Icon components for menu items
    const icons = {
        dashboard: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
        ),
        board: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
        absence: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        users: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        department: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        balance: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        report: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        new: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-16 left-0 z-20 w-64 h-[calc(100vh-64px)] bg-white border-r-4 border-black
          transition-transform duration-300 ease-in-out transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Sidebar content */}
                <nav className="h-full py-4 overflow-y-auto">
                    <div className="px-4 mb-6">
                        <h2 className="text-lg font-bold">Main Menu</h2>
                    </div>

                    <ul>
                        {getMenuItems().map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`
                    flex items-center px-4 py-3 font-medium
                    ${router.pathname === item.href
                                        ? 'border-l-8 border-yellow-400 bg-yellow-50 font-bold'
                                        : 'hover:bg-gray-100'
                                    }
                  `}
                                    onClick={onClose}
                                >
                                    <span className="mr-3 text-gray-600">{icons[item.icon]}</span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;