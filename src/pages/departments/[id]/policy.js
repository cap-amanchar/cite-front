import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MainLayout from '../../../components/layout/MainLayout';
import DepartmentPolicyForm from '../../../components/departments/DepartmentPolicyForm';
import { useAuth } from '../../../context/AuthContext';
import departmentService from '../../../services/departmentService';

const DepartmentPolicyPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { id } = router.query;

    const [department, setDepartment] = useState(null);
    const [policy, setPolicy] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    // Fetch department and policy data
    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    setLoadingData(true);

                    // Get department details
                    const departmentResponse = await departmentService.getDepartmentById(id);
                    setDepartment(departmentResponse.data);

                    // Get policy details
                    const policyResponse = await departmentService.getDepartmentPolicy(id);
                    setPolicy(policyResponse.data);
                } catch (err) {
                    console.error('Error fetching data:', err);
                    setError('Failed to load department policy. Please try again.');
                } finally {
                    setLoadingData(false);
                }
            }
        };

        fetchData();
    }, [id]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (!loading && user && user.role !== 'admin') {
            // Only admins can edit policies
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading || !user || loadingData) {
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
                    <p>You don't have permission to edit department policies.</p>
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

    // Show error if department or policy not found
    if (error || !department || !policy) {
        return (
            <MainLayout>
                <div className="p-6 border-3 border-red-500 bg-red-50 text-center">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error || 'Department policy not found'}</p>
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
                <title>Department Policy | Absence Management</title>
                <meta name="description" content="Edit department absence policy" />
            </Head>

            <MainLayout>
                <div className="py-4">
                    <h1 className="text-2xl font-bold mb-6">
                        Department Policy: {department.name}
                    </h1>
                    <DepartmentPolicyForm departmentId={id} initialData={policy} />
                </div>
            </MainLayout>
        </>
    );
};

export default DepartmentPolicyPage;