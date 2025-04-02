import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MainLayout from '../../../components/layout/MainLayout';
import UserForm from '../../../components/users/UserForm';
import { useAuth } from '../../../context/AuthContext';
import userService from '../../../services/userService';

const EditUserPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { id } = router.query;

    const [userData, setUserData] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            if (id) {
                try {
                    setLoadingUser(true);
                    const response = await userService.getUserById(id);
                    setUserData(response.data);
                } catch (err) {
                    console.error('Error fetching user:', err);
                    setError('Failed to load user. Please try again.');
                } finally {
                    setLoadingUser(false);
                }
            }
        };

        fetchUser();
    }, [id]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (!loading && user && user.role !== 'admin') {
            // Only admins can edit users
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading || !user || loadingUser) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Loading...</h2>
                    <p>Please wait...</p>
                </div>
            </div>
        );
    }

    // Only admins should access this page
    if (user.role !== 'admin') {
        return (
            <MainLayout>
                <div className="p-6 border-3 border-red-500 bg-red-50 text-center">
                    <h2 className="text-xl font-bold mb-2">Access Denied</h2>
                    <p>You don't have permission to edit users.</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold border-3 border-black hover:bg-blue-600"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </MainLayout>
        );
    }

    // Show error if user not found
    if (error || !userData) {
        return (
            <MainLayout>
                <div className="p-6 border-3 border-red-500 bg-red-50 text-center">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error || 'User not found'}</p>
                    <button
                        onClick={() => router.push('/users')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold border-3 border-black hover:bg-blue-600"
                    >
                        Back to Users
                    </button>
                </div>
            </MainLayout>
        );
    }

    return (
        <>
            <Head>
                <title>Edit User | Absence Management</title>
                <meta name="description" content="Edit user details" />
            </Head>

            <MainLayout>
                <div className="py-4">
                    <h1 className="text-2xl font-bold mb-6">Edit User</h1>
                    <UserForm initialData={userData} isEdit={true} />
                </div>
            </MainLayout>
        </>
    );
};

export default EditUserPage;