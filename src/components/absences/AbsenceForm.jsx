// src/components/absences/AbsenceForm.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { Textarea } from '../common/Input';
import absenceService from '../../services/absenceService';
import leaveBalanceService from '../../services/leaveBalanceService';

const AbsenceForm = ({ initialData = null, isEdit = false }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        type: '',
        hasDocumentation: false,
        comments: ''
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [leaveBalance, setLeaveBalance] = useState(null);
    const [showBalanceWarning, setShowBalanceWarning] = useState(false);
    const [calculatedDays, setCalculatedDays] = useState(0);

    // Load initial data if editing
    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                startDate: initialData.start_date || '',
                endDate: initialData.end_date || '',
                type: initialData.type || '',
                hasDocumentation: initialData.has_documentation || false,
                comments: initialData.comments || ''
            });
        }

        // Load leave balance
        fetchLeaveBalance();
    }, [isEdit, initialData]);

    // Fetch leave balance for the current employee
    const fetchLeaveBalance = async () => {
        try {
            const response = await leaveBalanceService.getCurrentBalance();
            setLeaveBalance(response.data);
        } catch (err) {
            console.error('Error fetching leave balance:', err);
            // Continue without balance data, form validation will handle insufficiency
        }
    };

    // Calculate days when dates change
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);

            // Check if dates are valid
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                // Check if end date is not before start date
                if (end >= start) {
                    const diffTime = Math.abs(end - start);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates

                    setCalculatedDays(diffDays);

                    // Check if we have balance data and if the requested days exceed balance
                    if (leaveBalance && formData.type) {
                        const balanceField = `${formData.type}Days`; // e.g., vacationDays
                        const remainingBalance = leaveBalance.remaining[formData.type];

                        setShowBalanceWarning(diffDays > remainingBalance);
                    }
                } else {
                    setCalculatedDays(0);
                }
            }
        }
    }, [formData.startDate, formData.endDate, formData.type, leaveBalance]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Clear error when field is updated
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
        } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
            newErrors.endDate = 'End date cannot be before start date';
        }

        if (!formData.type) {
            newErrors.type = 'Absence type is required';
        }

        // Check if there's sufficient leave balance
        if (leaveBalance && formData.type && calculatedDays > 0) {
            const remainingBalance = leaveBalance.remaining[formData.type];

            if (calculatedDays > remainingBalance) {
                newErrors.general = `Insufficient ${formData.type} leave balance. You have ${remainingBalance} days remaining.`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const requestData = {
                startDate: formData.startDate,
                endDate: formData.endDate,
                type: formData.type,
                hasDocumentation: formData.hasDocumentation,
                comments: formData.comments
            };

            if (isEdit && initialData) {
                await absenceService.updateAbsence(initialData.id, requestData);
            } else {
                await absenceService.createAbsence(requestData);
            }

            // Redirect to absences list
            router.push('/absences');
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                'Failed to submit request. Please try again.';

            setErrors({
                ...errors,
                general: errorMessage
            });

            console.error('Error submitting absence request:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{isEdit ? 'Edit Absence Request' : 'New Absence Request'}</CardTitle>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardBody>
                    {/* General error message */}
                    {errors.general && (
                        <div className="p-4 mb-4 font-bold text-red-700 bg-red-100 border-3 border-red-700">
                            {errors.general}
                        </div>
                    )}

                    {/* Balance warning */}
                    {showBalanceWarning && (
                        <div className="p-4 mb-4 font-bold text-amber-700 bg-amber-100 border-3 border-amber-700">
                            Warning: This request exceeds your available {formData.type} balance.
                            {leaveBalance && (
                                <div className="mt-2 text-sm font-normal">
                                    Your current {formData.type} balance: {leaveBalance.remaining[formData.type]} days
                                </div>
                            )}
                        </div>
                    )}

                    {/* Absence type */}
                    <Select
                        label="Absence Type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        options={[
                            { value: 'vacation', label: 'Vacation' },
                            { value: 'sick', label: 'Sick Leave' },
                            { value: 'personal', label: 'Personal' }
                        ]}
                        placeholder="Select absence type"
                        error={errors.type}
                        required
                    />

                    {/* Leave balances display */}
                    {leaveBalance && (
                        <div className="grid grid-cols-3 gap-4 p-4 mb-4 bg-gray-50 border-3 border-gray-300">
                            <div>
                                <div className="text-sm text-gray-500">Vacation Balance</div>
                                <div className="font-bold">{leaveBalance.remaining.vacation} / {leaveBalance.balance.vacation} days</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Sick Leave Balance</div>
                                <div className="font-bold">{leaveBalance.remaining.sick} / {leaveBalance.balance.sick} days</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Personal Balance</div>
                                <div className="font-bold">{leaveBalance.remaining.personal} / {leaveBalance.balance.personal} days</div>
                            </div>
                        </div>
                    )}

                    {/* Date range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            error={errors.startDate}
                            required
                        />

                        <Input
                            label="End Date"
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            error={errors.endDate}
                            required
                        />
                    </div>

                    {/* Days calculation */}
                    {calculatedDays > 0 && (
                        <div className="p-3 mb-4 text-center font-bold bg-blue-50 border-2 border-blue-500">
                            {calculatedDays} {calculatedDays === 1 ? 'day' : 'days'} requested
                        </div>
                    )}

                    {/* Documentation */}
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="hasDocumentation"
                            name="hasDocumentation"
                            checked={formData.hasDocumentation}
                            onChange={handleChange}
                            className="w-5 h-5 mr-2 border-3 border-black"
                        />
                        <label htmlFor="hasDocumentation" className="font-bold">
                            Documentation provided
                        </label>
                    </div>

                    {/* Comments */}
                    <Textarea
                        label="Comments"
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                        placeholder="Add any additional information about your absence request"
                        rows={4}
                    />
                </CardBody>

                <CardFooter className="flex justify-between">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : isEdit ? 'Update Request' : 'Submit Request'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default AbsenceForm;