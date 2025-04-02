// src/pages/absences/index.js
import React from 'react';
import Head from 'next/head';
import MainLayout from '../../components/layout/MainLayout';
import AbsenceList from '../../components/absences/AbsenceList';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const AbsencesPage = () => {
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
                    <p>Please wait while we load the absence requests.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Absence Requests | Absence Management</title>
                <meta name="description" content="View and manage absence requests" />
            </Head>

            <MainLayout>
                <div className="h-full">
                    <AbsenceList />
                </div>
            </MainLayout>
        </>
    );
};

export default AbsencesPage;