// src/pages/notifications/index.js
import React from 'react';
import Head from 'next/head';
import MainLayout from '../../components/layout/MainLayout';
import NotificationList from '../../components/notifications/NotificationList';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const NotificationsPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Loading...</h2>
                    <p>Please wait while we load your notifications.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Notifications | Absence Management</title>
                <meta name="description" content="View your notifications" />
            </Head>

            <MainLayout>
                <div className="h-full">
                    <NotificationList />
                </div>
            </MainLayout>
        </>
    );
};

export default NotificationsPage;