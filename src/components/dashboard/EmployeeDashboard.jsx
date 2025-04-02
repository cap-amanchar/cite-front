// src/components/dashboard/EmployeeDashboard.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardBody } from '../common/Card';
import Button from '../common/Button';
import { StatusBadge, TypeBadge } from '../common/Badge';
import absenceService from '../../services/absenceService';

const EmployeeDashboard = ({ user }) => {
    const [recentAbsences, setRecentAbsences] = useState([]);
    const [pendingAbsences, setPendingAbsences] = useState([]);
    const [leaveBalance, setLeaveBalance] = useState({
        vacation: 0,
        sick: 0,
        personal: 0,
        vacationUsed: 0,
        sickUsed: 0,
        personalUsed: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch recent absences
                const absencesResponse = await absenceService.getAllAbsences();
                const allAbsences = absencesResponse.data.requests || [];

                // Sort by submission time (most recent first)
                const sortedAbsences = allAbsences.sort((a, b) =>
                    new Date(b.submission_time) - new Date(a.submission_time)
                );

                // Set recent absences (last 5)
                setRecentAbsences(sortedAbsences.slice(0, 5));

                // Set pending absences
                setPendingAbsences(sortedAbsences.filter(a => a.status === 'pending'));

                // Mock leave balance data (would be replaced with real API call)
                setLeaveBalance({
                    vacation: 25,
                    sick: 12,
                    personal: 5,
                    vacationUsed: 10,
                    sickUsed: 2,
                    personalUsed: 1
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
                <h1 className="text-2xl font-bold mb-2">Hello, {user?.fullName || 'Employee'}!</h1>
                <p>Welcome to your absence management dashboard.</p>
            </div>

            {/* Error message */}
            {error && (
                <div className="p-4 font-bold text-red-700 bg-red-100 border-3 border-red-700">
                    {error}
                </div>
            )}

            {/* Quick stats and actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Leave balance summary */}
                <Card className="bg-blue-50">
                    <CardHeader>
                        <CardTitle>Your Leave Balance</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-white border-2 border-black">
                                <span>Vacation Days</span>
                                <span className="font-bold">{leaveBalance.vacation - leaveBalance.vacationUsed} / {leaveBalance.vacation}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-white border-2 border-black">
                                <span>Sick Days</span>
                                <span className="font-bold">{leaveBalance.sick - leaveBalance.sickUsed} / {leaveBalance.sick}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-white border-2 border-black">
                                <span>Personal Days</span>
                                <span className="font-bold">{leaveBalance.personal - leaveBalance.personalUsed} / {leaveBalance.personal}</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link href="/leave-balances">
                                <Button variant="info" fullWidth>View Detailed Balance</Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>

                {/* Pending requests */}
                <Card className="bg-amber-50">
                    <CardHeader>
                        <CardTitle>Pending Requests</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {pendingAbsences.length === 0 ? (
                            <div className="text-center py-4 bg-white border-2 border-black">
                                <p>No pending requests</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {pendingAbsences.slice(0, 3).map(absence => (
                                    <div key={absence.id} className="p-3 bg-white border-2 border-black">
                                        <div className="flex justify-between mb-1">
                                            <TypeBadge type={absence.type} />
                                            <StatusBadge status={absence.status} />
                                        </div>
                                        <div className="flex justify-between mt-2 text-sm">
                                            <span>{formatDate(absence.start_date)}</span>
                                            <span>→</span>
                                            <span>{formatDate(absence.end_date)}</span>
                                        </div>
                                    </div>
                                ))}

                                {pendingAbsences.length > 3 && (
                                    <div className="text-center mt-2 text-sm">
                                        +{pendingAbsences.length - 3} more pending requests
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="mt-4">
                            <Link href="/absences">
                                <Button variant="secondary" fullWidth>View All Requests</Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>

                {/* Quick actions */}
                <Card className="bg-green-50">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-3">
                            <Link href="/absences/new">
                                <Button fullWidth>Request New Absence</Button>
                            </Link>
                            <Link href="/absences">
                                <Button variant="secondary" fullWidth>View My Absences</Button>
                            </Link>
                            <Link href="/profile">
                                <Button variant="info" fullWidth>Update Profile</Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Recent absence requests */}
            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Absence Requests</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {recentAbsences.length === 0 ? (
                            <div className="text-center py-4">
                                <p>No recent absence requests</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                    <tr className="bg-gray-100 border-b-3 border-black">
                                        <th className="px-4 py-2 text-left">Type</th>
                                        <th className="px-4 py-2 text-left">Dates</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-left">Submitted</th>
                                        <th className="px-4 py-2 text-center">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {recentAbsences.map(absence => (
                                        <tr key={absence.id} className="border-b-2 border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <TypeBadge type={absence.type} />
                                            </td>
                                            <td className="px-4 py-3">
                                                {formatDate(absence.start_date)} - {formatDate(absence.end_date)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={absence.status} />
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {new Date(absence.submission_time).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Link href={`/absences/${absence.id}`}>
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
                                <Button variant="secondary">View All Absence Requests</Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default EmployeeDashboard;