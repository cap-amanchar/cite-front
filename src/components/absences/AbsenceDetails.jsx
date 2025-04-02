// src/components/absences/AbsenceDetails.jsx
import React, { useState, useEffect } from 'react';
import Modal, { ConfirmModal } from '../common/Modal';
import Button from '../common/Button';
import { Textarea } from '../common/Input';
import { StatusBadge, TypeBadge } from '../common/Badge';
import absenceService from '../../services/absenceService';
import { useAuth } from '../../context/AuthContext';

// Format date in a readable way
const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
};

// Calculate the number of days between two dates
const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date
    return diffDays;
};

const AbsenceDetails = ({ isOpen, onClose, absenceId, onStatusChange }) => {
    const { user } = useAuth();
    const [absence, setAbsence] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState('');

    // Confirmation modals
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Process status (loading)
    const [processing, setProcessing] = useState(false);

    // Fetch absence details
    useEffect(() => {
        if (isOpen && absenceId) {
            fetchAbsenceDetails();
        }
    }, [isOpen, absenceId]);

    const fetchAbsenceDetails = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await absenceService.getAbsenceById(absenceId);
            setAbsence(response.data);
        } catch (err) {
            setError('Failed to load absence details.');
            console.error('Error fetching absence details:', err);
        } finally {
            setLoading(false);
        }
    };

    // Check permissions
    const canProcess = (
        (user.role === 'manager' || user.role === 'admin') &&
        absence?.status === 'pending'
    );

    const canCancel = (
        (user.role === 'employee' && absence?.employee_account_id === user.id) ||
        (user.role === 'manager' && absence?.manager_id === user.id) ||
        user.role === 'admin'
    ) && absence?.status !== 'cancelled';

    // Process actions
    const handleApprove = async () => {
        setProcessing(true);
        try {
            await absenceService.processAbsence(absenceId, 'approve', comments);
            onStatusChange();
            onClose();
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
            await absenceService.processAbsence(absenceId, 'reject', comments);
            onStatusChange();
            onClose();
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
            await absenceService.cancelAbsence(absenceId);
            onStatusChange();
            onClose();
        } catch (err) {
            setError('Failed to cancel request.');
            console.error('Error cancelling request:', err);
        } finally {
            setProcessing(false);
            setShowCancelModal(false);
        }
    };

    // Render modal footer
    const renderFooter = () => {
        return (
            <>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>

                <div className="flex ml-auto space-x-2">
                    {canCancel && absence?.status !== 'cancelled' && (
                        <Button
                            variant="danger"
                            onClick={() => setShowCancelModal(true)}
                            disabled={processing}
                        >
                            Cancel Request
                        </Button>
                    )}

                    {canProcess && (
                        <>
                            <Button
                                variant="danger"
                                onClick={() => setShowRejectModal(true)}
                                disabled={processing}
                            >
                                Reject
                            </Button>

                            <Button
                                variant="success"
                                onClick={() => setShowApproveModal(true)}
                                disabled={processing}
                            >
                                Approve
                            </Button>
                        </>
                    )}
                </div>
            </>
        );
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Absence Request Details"
                size="lg"
                footer={renderFooter()}
            >
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="text-lg font-bold">Loading...</div>
                    </div>
                ) : error ? (
                    <div className="p-4 font-bold text-red-700 bg-red-100 border-3 border-red-700">
                        {error}
                    </div>
                ) : absence ? (
                    <div>
                        {/* Status and Type */}
                        <div className="flex justify-between mb-4">
                            <div>
                                <div className="mb-1 text-gray-600">Type</div>
                                <TypeBadge type={absence.type} />
                            </div>

                            <div className="text-right">
                                <div className="mb-1 text-gray-600">Status</div>
                                <StatusBadge status={absence.status} />
                            </div>
                        </div>

                        {/* Basic info */}
                        <div className="grid grid-cols-2 gap-4 p-4 mb-4 border-3 border-black bg-gray-50">
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

                        {/* Date info */}
                        <div className="p-4 mb-4 border-3 border-black bg-gray-50">
                            <div className="grid grid-cols-3 gap-4">
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
                        </div>

                        {/* Request info */}
                        <div className="p-4 mb-4 border-3 border-black bg-gray-50">
                            <div className="flex flex-wrap mb-4">
                                <div className="w-1/2 mb-2">
                                    <div className="mb-1 text-gray-600">Submission Date</div>
                                    <div>{new Date(absence.submission_time).toLocaleString()}</div>
                                </div>

                                <div className="w-1/2 mb-2">
                                    <div className="mb-1 text-gray-600">Documentation</div>
                                    <div>{absence.has_documentation ? 'Provided' : 'Not provided'}</div>
                                </div>

                                <div className="w-full">
                                    <div className="mb-1 text-gray-600">Comments</div>
                                    <div className="p-2 bg-white border-2 border-gray-300 min-h-16">
                                        {absence.comments || <em className="text-gray-500">No comments provided</em>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Approval comments (for managers/admins) */}
                        {canProcess && (
                            <div className="mb-4">
                                <Textarea
                                    label="Comments for approval/rejection"
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Add any comments about this decision..."
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-4 font-bold text-red-700 bg-red-100 border-3 border-red-700">
                        Absence request not found.
                    </div>
                )}
            </Modal>

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

export default AbsenceDetails;