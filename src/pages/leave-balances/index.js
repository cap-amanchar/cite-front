import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../../components/layout/MainLayout';
import LeaveBalanceCard from '../../components/leave/LeaveBalanceCard';
import Card, { CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import leaveBalanceService from '../../services/leaveBalanceService';
import departmentService from '../../services/departmentService';

const LeaveBalancesPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [ownBalance, setOwnBalance] = useState(null);
    const [teamBalances, setTeamBalances] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear.toString());

    // Generate year options
    const yearOptions = [
        { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
        { value: currentYear.toString(), label: currentYear.toString() },
        { value: (currentYear + 1).toString(), label: (currentYear + 1).toString() }
    ];

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Fetch departments for admin filter
    useEffect(() => {
        const fetchDepartments = async () => {
            if (user && user.role === 'admin') {
                try {
                    const response = await departmentService.getAllDepartments();
                    const departmentOptions = (response.data.departments || [])
                        .map(dept => ({
                            value: dept.id.toString(),
                            label: dept.name
                        }));

                    setDepartments(departmentOptions);
                } catch (err) {
                    console.error('Error fetching departments:', err);
                }
            }
        };

        if (user) {
            fetchDepartments();
        }
    }, [user]);

    // Fetch leave balance data
    useEffect(() => {
        const fetchBalances = async () => {
            if (!user) return;

            setLoadingData(true);
            setError(null);

            try {
                // Employee: get own balance
                if (user.role === 'employee') {
                    const response = await leaveBalanceService.getCurrentBalance(parseInt(year));
                    setOwnBalance(response.data);
                }
                // Manager/Admin: get team balances
                else {
                    const filters = { year: parseInt(year) };

                    // Add department filter for admins
                    if (user.role === 'admin' && selectedDepartment) {
                        filters.departmentId = parseInt(selectedDepartment);
                    }

                    const response = await leaveBalanceService.getTeamBalances(filters);
                    setTeamBalances(response.data.employees || []);
                }
            } catch (err) {
                console.error('Error fetching leave balances:', err);
                setError('Failed to load leave balances. Please try again.');
            } finally {
                setLoadingData(false);
            }
        };

        if (user) {
            fetchBalances();
        }
    }, [user, year, selectedDepartment]);

    // Show loading state while checking authentication
    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Loading...</h2>
                    <p>Please wait while we load the leave balances.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Leave Balances | Absence Management</title>
                <meta name="description" content={user.role === 'employee' ? "View your leave balance" : "Manage team leave balances"} />
            </Head>

            <MainLayout>
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between">
                        <h1 className="text-2xl font-bold">
                            {user.role === 'employee' ? 'My Leave Balance' : 'Team Leave Balances'}
                        </h1>

                        <div className="flex space-x-4">
                            {/* Year selector */}
                            <Select
                                name="year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                options={yearOptions}
                                className="w-32"
                            />

                            {/* Department filter for admins */}
                            {user.role === 'admin' && (
                                <Select
                                    name="departmentId"
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    options={[
                                        { value: '', label: 'All Departments' },
                                        ...departments
                                    ]}
                                    className="w-56"
                                />
                            )}
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="p-4 font-bold text-red-700 bg-red-100 border-3 border-red-700">
                            {error}
                        </div>
                    )}

                    {/* Loading state */}
                    {loadingData ? (
                        <div className="p-8 text-center">
                            <p className="text-lg font-bold">Loading leave balances...</p>
                        </div>
                    ) : (
                        <>
                            {/* Employee: show own balance */}
                            {user.role === 'employee' && ownBalance && (
                                <LeaveBalanceCard
                                    balance={ownBalance}
                                    title="Your Leave Balance"
                                />
                            )}

                            {/* Manager/Admin: show team balances */}
                            {(user.role === 'manager' || user.role === 'admin') && (
                                <div>
                                    {teamBalances.length === 0 ? (
                                        <div className="p-8 text-center border-3 border-dashed border-gray-300">
                                            <p className="text-lg font-bold mb-2">No employee leave balances found</p>
                                            {user.role === 'admin' && selectedDepartment && (
                                                <p className="text-gray-500">
                                                    Try selecting a different department or year.
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Team Leave Balances</CardTitle>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {teamBalances.map(employee => (
                                                        <Card key={employee.id} className="h-full bg-gray-50">
                                                            <CardHeader>
                                                                <CardTitle className="text-lg">{employee.name}</CardTitle>
                                                                <div className="text-sm text-gray-600">
                                                                    {employee.position} • {employee.department}
                                                                </div>
                                                            </CardHeader>
                                                            <CardBody>
                                                                <div className="space-y-2">
                                                                    {/* Vacation */}
                                                                    <div>
                                                                        <div className="flex justify-between mb-1">
                                                                            <span>Vacation</span>
                                                                            <span className="font-bold">
                                        {employee.remaining.vacation} / {employee.balance.vacation}
                                      </span>
                                                                        </div>
                                                                        <div className="w-full h-2 bg-gray-200 border border-black">
                                                                            <div
                                                                                className="h-full bg-sky-400"
                                                                                style={{
                                                                                    width: `${(employee.used.vacation / employee.balance.vacation) * 100}%`
                                                                                }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Sick */}
                                                                    <div>
                                                                        <div className="flex justify-between mb-1">
                                                                            <span>Sick</span>
                                                                            <span className="font-bold">
                                        {employee.remaining.sick} / {employee.balance.sick}
                                      </span>
                                                                        </div>
                                                                        <div className="w-full h-2 bg-gray-200 border border-black">
                                                                            <div
                                                                                className="h-full bg-red-400"
                                                                                style={{
                                                                                    width: `${(employee.used.sick / employee.balance.sick) * 100}%`
                                                                                }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Personal */}
                                                                    <div>
                                                                        <div className="flex justify-between mb-1">
                                                                            <span>Personal</span>
                                                                            <span className="font-bold">
                                        {employee.remaining.personal} / {employee.balance.personal}
                                      </span>
                                                                        </div>
                                                                        <div className="w-full h-2 bg-gray-200 border border-black">
                                                                            <div
                                                                                className="h-full bg-purple-400"
                                                                                style={{
                                                                                    width: `${(employee.used.personal / employee.balance.personal) * 100}%`
                                                                                }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Admin actions */}
                                                                {user.role === 'admin' && (
                                                                    <div className="mt-4">
                                                                        <Link href={`/leave-balances/${employee.id}`}>
                                                                            <Button variant="secondary" size="sm" fullWidth>
                                                                                Adjust Balance
                                                                            </Button>
                                                                        </Link>
                                                                    </div>
                                                                )}
                                                            </CardBody>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </MainLayout>
        </>
    );
};

export default LeaveBalancesPage