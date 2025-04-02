// src/pages/dashboard.js
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MainLayout from '../components/layout/MainLayout';
import EmployeeDashboard from '../components/dashboard/EmployeeDashboard';
import ManagerDashboard from '../components/dashboard/ManageDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            console.log('User not authenticated, redirecting to login');
            router.push('/login');
        } else if (user) {
            console.log('Dashboard loaded for user:', user.username, 'with role:', user.role);
        }
    }, [isAuthenticated, loading, router, user]);

    // Show loading state while checking authentication
    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Loading...</h2>
                    <p>Please wait while we prepare your dashboard.</p>
                </div>
            </div>
        );
    }

    // Render the appropriate dashboard based on user role
    const renderDashboard = () => {
        console.log('Rendering dashboard for role:', user.role);

        switch (user.role) {
            case 'admin':
                return <AdminDashboard user={user} />;
            case 'manager':
                return <ManagerDashboard user={user} />;
            case 'employee':
                return <EmployeeDashboard user={user} />;
            default:
                return (
                    <div className="p-6 text-center">
                        <h2 className="text-xl font-bold mb-2">Unknown User Role</h2>
                        <p>Your user account has an unrecognized role: {user.role}</p>
                    </div>
                );
        }
    };

    return (
        <>
            <Head>
                <title>Dashboard | Absence Management</title>
                <meta name="description" content="Manage your absences and time off" />
            </Head>

            <MainLayout>
                {renderDashboard()}
            </MainLayout>
        </>
    );
};

export default DashboardPage;