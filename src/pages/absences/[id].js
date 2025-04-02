import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MainLayout from '../../components/layout/MainLayout';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { StatusBadge, TypeBadge } from '../../components/common/Badge';
import { Textarea } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import absenceService from '../../services/absenceService';
import Modal, { ConfirmModal } from '../../components/common/Modal';

const AbsenceViewPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { id, action } = router.query;

    const [absence, setAbsence] = useState(null);
    const [loadingAbsence, setLoadingAbsence] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState('');

    // Modal states
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Processing state
    const [processing, setProcessing] = useState(false);

    // Handle action from URL query
    useEffect(() => {
        if (action && absence) {
            if (action === 'approve') {
                setShowApproveModal(true);
            } else if (action === 'reject') {
                setShowRejectModal(true);
            } else if (action === 'cancel') {
                setShowCancelModal(true);
            }

            // Clear the action from URL to prevent modal reopening on refresh
            router.replace(`/absences/${id}`, undefined, { shallow: true });
        }
    }, [action, absence, id, router]);

    // Fetch absence data
    useEffect(() => {
        const fetchAbsence = async () => {
            if (id) {
                try {
                    setLoadingAbsence(true);
                    const response = await absenceService.getAbsenceById(id);
                    setAbsence(response.data);
                } catch (err) {
                    console.error('Error fetching absence:', err);
                    setError('Failed to load absence request. Please try again.');
                } finally {
                    setLoadingAbsence(false);
                }
            }
        };

        fetchAbsence();
    }, [id]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading || !user || loadingAbsence) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Loading...</h2>
                    <p>Please wait...</p>
                </div>
            </div>
        );
    }

    // Handle absence not found
    if (error || !absence) {
        return (
            <MainLayout>
                <div className="p-6 border-3 border-red-500 bg-red-50 text-center">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error || 'Absence request not found'}</p>
                    <button
                        onClick={() => router.push('/absences')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold border-3 border-black hover:bg-blue-600"
                    >
                        Back to Absences
                    </button>
                </div>
            </MainLayout>
        );
    }

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    // Calculate days
    const calculateDays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
        return diffDays;
    };

    // Check permissions
    const canApproveOrReject = (
        (user.role === 'manager' || user.role === 'admin') &&
        absence.status === 'pending'
    );

    const canCancel = (
        (user.role === 'employee' && absence.employee_account_id === user.id) ||
        (user.role === 'manager' && absence.manager_id === user.id) ||
        user.role === 'admin'
    ) && absence.status !== 'cancelled';

    // Process actions
    const handleApprove = async () => {
        setProcessing(true);
        try {
            await absenceService.processAbsence(id, 'approve', comments);

            // Update local state
            setAbsence(prev => ({
                ...prev,
                status: 'approved'
            }));

            setComments('');
        } catch (err) {
            setError('Failed to approve request.');
            console.error('Error approving request:', err);
        } finally {
            setProcessing(false);
            setShowApproveModal(false);
        }
    };

    const handleReject = async () => {
        setProcessing(true);
        try {
            await absenceService.processAbsence(id, 'reject', comments);

            // Update local state
            setAbsence(prev => ({
                ...prev,
                status: 'rejected'
            }));

            setComments('');
        } catch (err) {
            setError('Failed to reject request.');
            console.error('Error rejecting request:', err);
        } finally {
            setProcessing(false);
            setShowRejectModal(false);
        }
    };

    const handleCancel = async () => {
        setProcessing(true);
        try {
            await absenceService.cancelAbsence(id);

            // Update local state
            setAbsence(prev => ({
                ...prev,
                status: 'cancelled'
            }));
        } catch (err) {
            setError('Failed to cancel request.');
            console.error('Error cancelling request:', err);
        } finally {
            setProcessing(false);
            setShowCancelModal(false);
        }
    };

    return (
        <>
            <Head>
                <title>Absence Request | Absence Management</title>
                <meta name="description" content="View absence request details" />
            </Head>

            <MainLayout>
                <div className="max-w-4xl mx-auto py-4">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">Absence Request Details</h1>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="secondary"
                                onClick={() => router.push('/absences')}
                            >
                                Back to Absences
                            </Button>

                            {canCancel && absence.status !== 'cancelled' && (
                                <Button
                                    variant="danger"
                                    onClick={() => setShowCancelModal(true)}
                                >
                                    Cancel Request
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="p-4 mb-4 font-bold text-red-700 bg-red-100 border-3 border-red-700">
                            {error}
                        </div>
                    )}

                    {/* Status and Type */}
                    <div className="flex flex-wrap justify-between mb-4">
                        <div className="mb-2">
                            <div className="mb-1 text-gray-600">Type</div>
                            <TypeBadge type={absence.type} />
                        </div>

                        <div className="mb-2 text-right">
                            <div className="mb-1 text-gray-600">Status</div>
                            <StatusBadge status={absence.status} />
                        </div>
                    </div>

                    {/* Basic info */}
                    <Card className="mb-4 bg-gray-50">
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="mb-1 text-gray-600">Employee</div>
                                    <div className="font-bold">{absence.employee_name}</div>
                                </div>

                                <div>
                                    <div className="mb-1 text-gray-600">Department</div>
                                    <div className="font-bold">{absence.department_name}</div>
                                </div>

                                <div className="col-span-2">
                                    <div className="mb-1 text-gray-600">Email</div>
                                    <div>{absence.employee_email}</div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Date info */}
                    <Card className="mb-4 bg-blue-50">
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="mb-1 text-gray-600">Start Date</div>
                                    <div className="font-bold">{formatDate(absence.start_date)}</div>
                                </div>

                                <div>
                                    <div className="mb-1 text-gray-600">End Date</div>
                                    <div className="font-bold">{formatDate(absence.end_date)}</div>
                                </div>

                                <div>
                                    <div className="mb-1 text-gray-600">Duration</div>
                                    <div className="font-bold">
                                        {calculateDays(absence.start_date, absence.end_date)} days
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Request info */}
                    <Card className="mb-4">
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className="mb-1 text-gray-600">Submission Date</div>
                                    <div>{new Date(absence.submission_time).toLocaleString()}</div>
                                </div>

                                <div>
                                    <div className="mb-1 text-gray-600">Documentation</div>
                                    <div>{absence.has_documentation ? 'Provided' : 'Not provided'}</div>
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 text-gray-600">Comments</div>
                                <div className="p-3 bg-gray-50 border-2 border-gray-300 min-h-16">
                                    {absence.comments || <em className="text-gray-500">No comments provided</em>}
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Manager actions */}
                    {canApproveOrReject && (
                        <Card className="mb-4 bg-yellow-50 border-3 border-black">
                            <CardHeader>
                                <CardTitle>Manager Actions</CardTitle>
                            </CardHeader>

                            <CardBody>
                                <Textarea
                                    label="Decision Comments"
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Add any comments about your decision..."
                                    rows={3}
                                />
                            </CardBody>

                            <CardFooter className="flex justify-end space-x-3">
                                <Button
                                    variant="danger"
                                    onClick={() => setShowRejectModal(true)}
                                >
                                    Reject
                                </Button>

                                <Button
                                    variant="success"
                                    onClick={() => setShowApproveModal(true)}
                                >
                                    Approve
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Action history - In a real app, this would show the history of actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Request Timeline</CardTitle>
                        </CardHeader>

                        <CardBody>
                            <div className="border-l-2 border-gray-300 pl-4 space-y-6">
                                <div className="relative">
                                    <div className="absolute -left-6 mt-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full"></div>
                                    <div className="font-bold">Request Submitted</div>
                                    <div className="text-sm text-gray-600">
                                        {new Date(absence.submission_time).toLocaleString()}
                                    </div>
                                </div>

                                {absence.status !== 'pending' && (
                                    <div className="relative">
                                        <div className={`absolute -left-6 mt-1 w-4 h-4 
                      ${absence.status === 'approved' ? 'bg-green-500' :
                                            absence.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'} 
                      border-2 border-white rounded-full`}></div>
                                        <div className="font-bold">
                                            Request {absence.status.charAt(0).toUpperCase() + absence.status.slice(1)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {/* In a real app, this would show the actual time */}
                                            {new Date().toLocaleString()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </MainLayout>

            {/* Confirmation Modals */}
            <ConfirmModal
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                onConfirm={handleApprove}
                title="Approve Absence Request"
                message="Are you sure you want to approve this absence request?"
                confirmText="Approve"
                variant="success"
            />

            <ConfirmModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={handleReject}
                title="Reject Absence Request"
                message="Are you sure you want to reject this absence request?"
                confirmText="Reject"
                variant="danger"
            />

            <ConfirmModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancel}
                title="Cancel Absence Request"
                message="Are you sure you want to cancel this absence request?"
                confirmText="Cancel Request"
                variant="danger"
            />
        </>
    );
};

export default AbsenceViewPage;