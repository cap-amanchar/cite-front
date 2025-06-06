import React from 'react';
import Head from 'next/head';
import MainLayout from '../../components/layout/MainLayout';
import DepartmentList from '../../components/departments/DepartmentList';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const DepartmentsPage = () => {
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
                    <p>Please wait while we load the departments.</p>
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
                    <p>You don't have permission to manage departments.</p>
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
                <title>Departments | Absence Management</title>
                <meta name="description" content="Manage departments" />
            </Head>

            <MainLayout>
                <div className="h-full">
                    <DepartmentList />
                </div>
            </MainLayout>
        </>
    );
};

export default DepartmentsPage;
