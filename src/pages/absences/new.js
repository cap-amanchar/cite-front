// src/pages/absences/new.js
import React from 'react';
import Head from 'next/head';
import MainLayout from '../../components/layout/MainLayout';
import AbsenceForm from '../../components/absences/AbsenceForm';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const NewAbsencePage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (!loading && user && user.role !== 'employee') {
            // Only employees can create new absence requests
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Loading...</h2>
                    <p>Please wait...</p>
                </div>
            </div>
        );
    }

    // Only employees can create new absence requests
    if (user.role !== 'employee') {
        return (
            <MainLayout>
                <div className="p-6 border-3 border-red-500 bg-red-50 text-center">
                    <h2 className="text-xl font-bold mb-2">Access Denied</h2>
                    <p>Only employees can create new absence requests.</p>
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

    return (
        <>
            <Head>
                <title>New Absence Request | Absence Management</title>
                <meta name="description" content="Create a new absence request" />
            </Head>

            <MainLayout>
                <div className="py-4">
                    <h1 className="text-2xl font-bold mb-6">Create New Absence Request</h1>
                    <AbsenceForm />
                </div>
            </MainLayout>
        </>
    );
};

export default NewAbsencePage;