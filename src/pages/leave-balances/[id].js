import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MainLayout from '../../components/layout/MainLayout';
import LeaveBalanceForm from '../../components/leave/LeaveBalanceForm';
import LeaveBalanceCard from '../../components/leave/LeaveBalanceCard';
import { useAuth } from '../../context/AuthContext';
import leaveBalanceService from '../../services/leaveBalanceService';
import userService from '../../services/userService';

const EditLeaveBalancePage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { id } = router.query;

    const [employee, setEmployee] = useState(null);
    const [leaveBalance, setLeaveBalance] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    // Fetch employee and balance data
    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    setLoadingData(true);

                    // Get employee details
                    const userResponse = await userService.getUserById(id);
                    setEmployee(userResponse.data);

                    // Get leave balance
                    const currentYear = new Date().getFullYear();
                    const balanceResponse = await leaveBalanceService.getEmployeeBalance(id, currentYear);
                    setLeaveBalance(balanceResponse.data);
                } catch (err) {
                    console.error('Error fetching data:', err);
                    setError('Failed to load employee leave balance. Please try again.');
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
            // Only admins can edit leave balances
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
                    <p>You don't have permission to edit leave balances.</p>
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

    // Show error if employee or balance not found
    if (error || !employee) {
        return (
            <MainLayout>
                <div className="p-6 border-3 border-red-500 bg-red-50 text-center">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error || 'Employee not found'}</p>
                    <button
                        onClick={() => router.push('/leave-balances')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold border-3 border-black hover:bg-blue-600"
                    >
                        Back to Leave Balances
                    </button>
                </div>
            </MainLayout>
        );
    }

    const handleSuccessfulUpdate = () => {
        // Refresh the balance data
        const fetchUpdatedBalance = async () => {
            try {
                const currentYear = new Date().getFullYear();
                const response = await leaveBalanceService.getEmployeeBalance(id, currentYear);
                setLeaveBalance(response.data);
            } catch (err) {
                console.error('Error fetching updated balance:', err);
            }
        };

        fetchUpdatedBalance();
    };

    return (
        <>
            <Head>
                <title>Edit Leave Balance | Absence Management</title>
                <meta name="description" content="Edit employee leave balance" />
            </Head>

            <MainLayout>
                <div className="py-4">
                    <h1 className="text-2xl font-bold mb-6">
                        Edit Leave Balance: {employee.full_name}
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Current balance */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">Current Balance</h2>
                            {leaveBalance ? (
                                <LeaveBalanceCard
                                    balance={leaveBalance}
                                    title={`${employee.full_name}'s Leave Balance`}
                                />
                            ) : (
                                <div className="p-4 font-bold text-amber-700 bg-amber-100 border-3 border-amber-700">
                                    No leave balance found for the current year.
                                </div>
                            )}
                        </div>

                        {/* Update form */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">Update Balance</h2>
                            <LeaveBalanceForm
                                employeeId={id}
                                initialData={leaveBalance}
                                onSuccess={handleSuccessfulUpdate}
                            />
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    );
};

export default EditLeaveBalancePage;