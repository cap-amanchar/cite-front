// src/components/dashboard/ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardBody } from '../common/Card';
import Button from '../common/Button';
import { StatusBadge, TypeBadge } from '../common/Badge';
import absenceService from '../../services/absenceService';

const ManagerDashboard = ({ user }) => {
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [teamAbsences, setTeamAbsences] = useState([]);
    const [teamStats, setTeamStats] = useState({
        totalTeamMembers: 0,
        absentToday: 0,
        pendingRequests: 0,
        upcomingAbsences: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch all team absences
                const absencesResponse = await absenceService.getAllAbsences();
                const allAbsences = absencesResponse.data.requests || [];

                // Filter out pending requests that need approval
                const pendingRequests = allAbsences.filter(a => a.status === 'pending');
                setPendingApprovals(pendingRequests);

                // Sort by start date (upcoming first)
                const sortedAbsences = [...allAbsences].sort((a, b) =>
                    new Date(a.start_date) - new Date(b.start_date)
                );

                // Recent team absences (approved only)
                const approvedAbsences = sortedAbsences.filter(a => a.status === 'approved');
                setTeamAbsences(approvedAbsences.slice(0, 5));

                // Calculate team stats
                const today = new Date().toISOString().split('T')[0];

                setTeamStats({
                    totalTeamMembers: 10, // Mock data, would come from API
                    absentToday: approvedAbsences.filter(a =>
                        a.start_date <= today && a.end_date >= today
                    ).length,
                    pendingRequests: pendingRequests.length,
                    upcomingAbsences: approvedAbsences.filter(a =>
                        a.start_date > today
                    ).length
                });
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
                <h1 className="text-2xl font-bold mb-2">Hello, {user?.fullName || 'Manager'}!</h1>
                <p>Welcome to your team absence management dashboard.</p>
            </div>

            {/* Error message */}
            {error && (
                <div className="p-4 font-bold text-red-700 bg-red-100 border-3 border-red-700">
                    {error}
                </div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-blue-50">
                    <CardBody>
                        <div className="text-center">
                            <div className="text-4xl font-bold">{teamStats.totalTeamMembers}</div>
                            <div className="mt-2">Team Members</div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-green-50">
                    <CardBody>
                        <div className="text-center">
                            <div className="text-4xl font-bold">{teamStats.absentToday}</div>
                            <div className="mt-2">Absent Today</div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-amber-50">
                    <CardBody>
                        <div className="text-center">
                            <div className="text-4xl font-bold">{teamStats.pendingRequests}</div>
                            <div className="mt-2">Pending Approvals</div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-purple-50">
                    <CardBody>
                        <div className="text-center">
                            <div className="text-4xl font-bold">{teamStats.upcomingAbsences}</div>
                            <div className="mt-2">Upcoming Absences</div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending approvals */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Approvals</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {pendingApprovals.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">No pending approval requests</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pendingApprovals.slice(0, 5).map(absence => (
                                    <div key={absence.id} className="p-4 border-3 border-black bg-amber-50">
                                        <div className="flex justify-between mb-2">
                                            <TypeBadge type={absence.type} />
                                            <StatusBadge status={absence.status} />
                                        </div>

                                        <div className="mb-2">
                                            <div className="font-bold">{absence.employee_name}</div>
                                            <div className="text-sm text-gray-600">{absence.department_name}</div>
                                        </div>

                                        <div className="flex justify-between mb-3 px-2 py-1 bg-white border-2 border-black">
                                            <span>{formatDate(absence.start_date)}</span>
                                            <span>→</span>
                                            <span>{formatDate(absence.end_date)}</span>
                                        </div>

                                        <div className="flex space-x-2">
                                            <Link href={`/absences/${absence.id}`} className="flex-1">
                                                <Button variant="secondary" fullWidth size="sm">
                                                    View Details
                                                </Button>
                                            </Link>
                                            <Link href={`/absences/${absence.id}?action=approve`} className="flex-1">
                                                <Button variant="success" fullWidth size="sm">
                                                    Approve
                                                </Button>
                                            </Link>
                                            <Link href={`/absences/${absence.id}?action=reject`} className="flex-1">
                                                <Button variant="danger" fullWidth size="sm">
                                                    Reject
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}

                                {pendingApprovals.length > 5 && (
                                    <div className="text-center mt-2">
                                        +{pendingApprovals.length - 5} more pending approvals
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-4 text-center">
                            <Link href="/absences/board">
                                <Button>Go to Absence Board</Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>

                {/* Team calendar / absences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Team Absences</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {teamAbsences.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">No upcoming team absences</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                    <tr className="bg-gray-100 border-b-3 border-black">
                                        <th className="px-4 py-2 text-left">Employee</th>
                                        <th className="px-4 py-2 text-left">Type</th>
                                        <th className="px-4 py-2 text-left">Dates</th>
                                        <th className="px-4 py-2 text-center">Duration</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {teamAbsences.map(absence => {
                                        // Calculate days
                                        const start = new Date(absence.start_date);
                                        const end = new Date(absence.end_date);
                                        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

                                        return (
                                            <tr key={absence.id} className="border-b-2 border-gray-200 hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium">
                                                    {absence.employee_name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <TypeBadge type={absence.type} />
                                                </td>
                                                <td className="px-4 py-3">
                                                    {formatDate(absence.start_date)} - {formatDate(absence.end_date)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {days} {days === 1 ? 'day' : 'days'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="mt-4 text-center">
                            <Link href="/reports/team">
                                <Button variant="secondary">View Team Report</Button>
                            </Link>
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
                            <p>Manage team absence requests in a Kanban view</p>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/leave-balances">
                    <Card className="bg-green-50 hover:translate-y-[-4px] transition-transform cursor-pointer h-full">
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                            <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <h3 className="font-bold text-lg mb-1">Leave Balances</h3>
                            <p>View team leave balances and allocation</p>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/reports/team">
                    <Card className="bg-blue-50 hover:translate-y-[-4px] transition-transform cursor-pointer h-full">
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                            <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="font-bold text-lg mb-1">Team Reports</h3>
                            <p>Generate absence reports and analytics</p>
                        </CardBody>
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default ManagerDashboard;