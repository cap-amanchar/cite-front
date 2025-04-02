// src/pages/absences/board.js
import React from 'react';
import Head from 'next/head';
import MainLayout from '../../components/layout/MainLayout';
import AbsenceBoard from '../../components/absences/AbsenceBoard';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const AbsenceBoardPage = () => {
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
                    <p>Please wait while we load the absence board.</p>
                </div>
            </div>
        );
    }

    // Check if user is authorized to view the board (managers & admins)
    if (user.role !== 'admin' && user.role !== 'manager') {
        return (
            <MainLayout>
                <div className="p-6 border-3 border-red-500 bg-red-50 text-center">
                    <h2 className="text-xl font-bold mb-2">Access Denied</h2>
                    <p>You don't have permission to view the absence board.</p>
                    <p className="mt-2">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white font-bold border-3 border-black hover:bg-blue-600"
                        >
                            Return to Dashboard
                        </button>
                    </p>
                </div>
            </MainLayout>
        );
    }

    return (
        <>
            <Head>
                <title>Absence Board | Absence Management</title>
                <meta name="description" content="Kanban board view for managing absence requests" />
            </Head>

            <MainLayout>
                <AbsenceBoard />
            </MainLayout>
        </>
    );
};

export default AbsenceBoardPage;