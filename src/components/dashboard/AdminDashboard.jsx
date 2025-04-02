// src/components/dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardBody } from '../common/Card';
import Button from '../common/Button';
import { StatusBadge } from '../common/Badge';
import absenceService from '../../services/absenceService';

const AdminDashboard = ({ user }) => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDepartments: 0,
        absentToday: 0,
        pendingRequests: 0
    });
    const [recentRequests, setRecentRequests] = useState([]);
    const [departmentStats, setDepartmentStats] = useState([]);
    const [absenceTypeStats, setAbsenceTypeStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);

            try {
                // In a real application, these would be separate API calls
                // For now, using mock data for some of these

                // Fetch all absences to get pending requests and today's absences
                const absencesResponse = await absenceService.getAllAbsences();
                const allAbsences = absencesResponse.data.requests || [];

                // Filter recent requests
                const sortedAbsences = [...allAbsences].sort((a, b) =>
                    new Date(b.submission_time) - new Date(a.submission_time)
                );

                setRecentRequests(sortedAbsences.slice(0, 5));

                // Calculate statistics
                const today = new Date().toISOString().split('T')[0];

                // Mock data for other stats
                setStats({
                    totalEmployees: 42,
                    totalDepartments: 5,
                    absentToday: allAbsences.filter(a =>
                        a.status === 'approved' &&
                        a.start_date <= today &&
                        a.end_date >= today
                    ).length,
                    pendingRequests: allAbsences.filter(a => a.status === 'pending').length
                });

                // Mock data for department stats
                setDepartmentStats([
                    { name: 'Engineering', employeeCount: 20, absentToday: 3, pendingRequests: 2 },
                    { name: 'Human Resources', employeeCount: 5, absentToday: 1, pendingRequests: 0 },
                    { name: 'Marketing', employeeCount: 8, absentToday: 0, pendingRequests: 1 },
                    { name: 'Finance', employeeCount: 6, absentToday: 1, pendingRequests: 1 },
                    { name: 'Sales', employeeCount: 10, absentToday: 2, pendingRequests: 2 }
                ]);

                // Calculate absence type statistics
                const absenceTypes = {
                    vacation: 0,
                    sick: 0,
                    personal: 0
                };

                allAbsences.forEach(absence => {
                    if (absence.type in absenceTypes) {
                        absenceTypes[absence.type]++;
                    }
                });

                setAbsenceTypeStats([
                    { type: 'Vacation', count: absenceTypes.vacation },
                    { type: 'Sick Leave', count: absenceTypes.sick },
                    { type: 'Personal', count: absenceTypes.personal }
                ]);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please refresh to try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Format date helper
    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <div className="text-center py-8">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Welcome message */}
            <div className="p-6 border-3 border-black bg-yellow-100">
                <h1 className="text-2xl font-bold mb-2">Welcome, {user?.fullName || 'Administrator'}!</h1>
                <p>Here's an overview of absence management across the organization.</p>
            </div>

            {/* Error message */}
            {error && (
                <div className="p-4 font-bold text-red-700 bg-red-100 border-3 border-red-700">
                    {error}
                </div>
            )}

            {/* Overall stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-blue-50">
                    <CardBody>
                        <div className="text-center">
                            <div className="text-4xl font-bold">{stats.totalEmployees}</div>
                            <div className="mt-2">Total Employees</div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-green-50">
                    <CardBody>
                        <div className="text-center">
                            <div className="text-4xl font-bold">{stats.totalDepartments}</div>
                            <div className="mt-2">Departments</div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-amber-50">
                    <CardBody>
                        <div className="text-center">
                            <div className="text-4xl font-bold">{stats.absentToday}</div>
                            <div className="mt-2">Absent Today</div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-purple-50">
                    <CardBody>
                        <div className="text-center">
                            <div className="text-4xl font-bold">{stats.pendingRequests}</div>
                            <div className="mt-2">Pending Requests</div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/absences/board">
                    <Card className="bg-yellow-50 hover:translate-y-[-4px] transition-transform cursor-pointer h-full">
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                            <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="font-bold text-lg mb-1">Absence Board</h3>
                            <p>Manage all absence requests</p>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/users">
                    <Card className="bg-blue-50 hover:translate-y-[-4px] transition-transform cursor-pointer h-full">
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                            <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <h3 className="font-bold text-lg mb-1">User Management</h3>
                            <p>Manage employees, managers and admins</p>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/departments">
                    <Card className="bg-green-50 hover:translate-y-[-4px] transition-transform cursor-pointer h-full">
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                            <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 className="font-bold text-lg mb-1">Departments</h3>
                            <p>Manage departments and policies</p>
                        </CardBody>
                    </Card>
                </Link>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Department Statistics</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="bg-gray-100 border-b-3 border-black">
                                    <th className="px-4 py-2 text-left">Department</th>
                                    <th className="px-4 py-2 text-center">Employees</th>
                                    <th className="px-4 py-2 text-center">Absent Today</th>
                                    <th className="px-4 py-2 text-center">Pending</th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {departmentStats.map(dept => (
                                    <tr key={dept.name} className="border-b-2 border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{dept.name}</td>
                                        <td className="px-4 py-3 text-center">{dept.employeeCount}</td>
                                        <td className="px-4 py-3 text-center">{dept.absentToday}</td>
                                        <td className="px-4 py-3 text-center">{dept.pendingRequests}</td>
                                        <td className="px-4 py-3 text-center">
                                            <Link href={`/departments/${dept.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                                <Button size="sm" variant="secondary">View</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 text-center">
                            <Link href="/departments">
                                <Button variant="secondary">Manage Departments</Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>

                {/* Recent requests */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Absence Requests</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {recentRequests.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">No recent absence requests</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                    <tr className="bg-gray-100 border-b-3 border-black">
                                        <th className="px-4 py-2 text-left">Employee</th>
                                        <th className="px-4 py-2 text-left">Department</th>
                                        <th className="px-4 py-2 text-left">Dates</th>
                                        <th className="px-4 py-2 text-center">Status</th>
                                        <th className="px-4 py-2 text-center">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {recentRequests.map(request => (
                                        <tr key={request.id} className="border-b-2 border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{request.employee_name}</td>
                                            <td className="px-4 py-3">{request.department_name}</td>
                                            <td className="px-4 py-3">
                                                {formatDate(request.start_date)} - {formatDate(request.end_date)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <StatusBadge status={request.status} />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Link href={`/absences/${request.id}`}>
                                                    <Button size="sm" variant="secondary">View</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="mt-4 text-center">
                            <Link href="/absences">
                                <Button variant="secondary">View All Absences</Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Additional actions row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/reports/team">
                    <Card className="bg-indigo-50 hover:translate-y-[-4px] transition-transform cursor-pointer h-full">
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                            <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="font-bold text-lg mb-1">Reports & Analytics</h3>
                            <p>Generate absence reports and analytics</p>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/leave-balances">
                    <Card className="bg-purple-50 hover:translate-y-[-4px] transition-transform cursor-pointer h-full">
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                            <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <h3 className="font-bold text-lg mb-1">Leave Balances</h3>
                            <p>Manage leave balances across the organization</p>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/users/new">
                    <Card className="bg-pink-50 hover:translate-y-[-4px] transition-transform cursor-pointer h-full">
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                            <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            <h3 className="font-bold text-lg mb-1">Add New User</h3>
                            <p>Create a new employee, manager or admin</p>
                        </CardBody>
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;