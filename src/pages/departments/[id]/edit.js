import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MainLayout from '../../../components/layout/MainLayout';
import DepartmentForm from '../../../components/departments/DepartmentForm';
import { useAuth } from '../../../context/AuthContext';
import departmentService from '../../../services/departmentService';

const EditDepartmentPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { id } = router.query;

    const [department, setDepartment] = useState(null);
    const [loadingDepartment, setLoadingDepartment] = useState(true);
    const [error, setError] = useState(null);

    // Fetch department data
    useEffect(() => {
        const fetchDepartment = async () => {
            if (id) {
                try {
                    setLoadingDepartment(true);
                    const response = await departmentService.getDepartmentById(id);
                    setDepartment(response.data);
                } catch (err) {
                    console.error('Error fetching department:', err);
                    setError('Failed to load department. Please try again.');
                } finally {
                    setLoadingDepartment(false);
                }
            }
        };

        fetchDepartment();
    }, [id]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (!loading && user && user.role !== 'admin') {
            // Only admins can edit departments
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading || !user || loadingDepartment) {
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
                    <p>You don't have permission to edit departments.</p>
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

    // Show error if department not found
    if (error || !department) {
        return (
            <MainLayout>
                <div className="p-6 border-3 border-red-500 bg-red-50 text-center">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error || 'Department not found'}</p>
                    <button
                        onClick={() => router.push('/departments')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold border-3 border-black hover:bg-blue-600"
                    >
                        Back to Departments
                    </button>
                </div>
            </MainLayout>
        );
    }

    return (
        <>
            <Head>
                <title>Edit Department | Absence Management</title>
                <meta name="description" content="Edit department details" />
            </Head>

            <MainLayout>
                <div className="py-4">
                    <h1 className="text-2xl font-bold mb-6">Edit Department</h1>
                    <DepartmentForm initialData={department} isEdit={true} />
                </div>
            </MainLayout>
        </>
    );
};

export default EditDepartmentPage;
