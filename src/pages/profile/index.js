// src/pages/profile/index.js
import React from 'react';
import Head from 'next/head';
import MainLayout from '../../components/layout/MainLayout';
import UserProfile from '../../components/users/UserProfile';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const ProfilePage = () => {
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
                    <p>Please wait while we load your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>My Profile | Absence Management</title>
                <meta name="description" content="Manage your user profile" />
            </Head>

            <MainLayout>
                <div className="py-4">
                    <h1 className="text-2xl font-bold mb-6">My Profile</h1>
                    <UserProfile />
                </div>
            </MainLayout>
        </>
    );
};

export default ProfilePage;