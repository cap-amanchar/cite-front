// src/components/departments/DepartmentPolicyForm.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import departmentService from '../../services/departmentService';

const DepartmentPolicyForm = ({ departmentId, initialData = null }) => {
    const router = useRouter();
    const [department, setDepartment] = useState(null);
    const [formData, setFormData] = useState({
        minDaysNotice: '',
        maxConsecutiveDays: '',
        approvalRequired: true,
        documentationRequiredAfter: '',
        maxSickDays: '',
        maxVacationDays: '',
        maxPersonalDays: ''
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load department and policy data
    useEffect(() => {
        const fetchDepartmentAndPolicy = async () => {
            setLoading(true);

            try {
                // Fetch department details
                const departmentResponse = await departmentService.getDepartmentById(departmentId);
                setDepartment(departmentResponse.data);

                // Fetch policy or use initialData if provided
                if (initialData) {
                    setFormData({
                        minDaysNotice: initialData.min_days_notice?.toString() || '',
                        maxConsecutiveDays: initialData.max_consecutive_days?.toString() || '',
                        approvalRequired: initialData.approval_required !== false,
                        documentationRequiredAfter: initialData.documentation_required_after?.toString() || '',
                        maxSickDays: initialData.max_sick_days?.toString() || '',
                        maxVacationDays: initialData.max_vacation_days?.toString() || '',
                        maxPersonalDays: initialData.max_personal_days?.toString() || ''
                    });
                } else {
                    const policyResponse = await departmentService.getDepartmentPolicy(departmentId);
                    const policy = policyResponse.data;

                    setFormData({
                        minDaysNotice: policy.min_days_notice?.toString() || '',
                        maxConsecutiveDays: policy.max_consecutive_days?.toString() || '',
                        approvalRequired: policy.approval_required !== false,
                        documentationRequiredAfter: policy.documentation_required_after?.toString() || '',
                        maxSickDays: policy.max_sick_days?.toString() || '',
                        maxVacationDays: policy.max_vacation_days?.toString() || '',
                        maxPersonalDays: policy.max_personal_days?.toString() || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching department or policy data:', err);
                setErrors({
                    general: 'Failed to load department policy. Please try again.'
                });
            } finally {
                setLoading(false);
            }
        };

        if (departmentId) {
            fetchDepartmentAndPolicy();
        }
    }, [departmentId, initialData]);

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

        // Validate number fields
        const numericFields = [
            'minDaysNotice',
            'maxConsecutiveDays',
            'documentationRequiredAfter',
            'maxSickDays',
            'maxVacationDays',
            'maxPersonalDays'
        ];

        numericFields.forEach(field => {
            if (formData[field] && (isNaN(parseInt(formData[field])) || parseInt(formData[field]) < 0)) {
                newErrors[field] = 'Must be a positive number';
            }
        });

        // Require at least some basic policy settings
        if (!formData.maxSickDays && !formData.maxVacationDays && !formData.maxPersonalDays) {
            newErrors.general = 'At least one leave type maximum must be set';
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
            const policyData = {
                minDaysNotice: formData.minDaysNotice ? parseInt(formData.minDaysNotice) : undefined,
                maxConsecutiveDays: formData.maxConsecutiveDays ? parseInt(formData.maxConsecutiveDays) : undefined,
                approvalRequired: formData.approvalRequired,
                documentationRequiredAfter: formData.documentationRequiredAfter ? parseInt(formData.documentationRequiredAfter) : undefined,
                maxSickDays: formData.maxSickDays ? parseInt(formData.maxSickDays) : undefined,
                maxVacationDays: formData.maxVacationDays ? parseInt(formData.maxVacationDays) : undefined,
                maxPersonalDays: formData.maxPersonalDays ? parseInt(formData.maxPersonalDays) : undefined
            };

            await departmentService.updateDepartmentPolicy(departmentId, policyData);

            router.push(`/departments/${departmentId}`);
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                'Failed to update department policy. Please try again.';

            setErrors({
                ...errors,
                general: errorMessage
            });

            console.error('Error updating department policy:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (loading) {
        return (
            <Card className="max-w-3xl mx-auto">
                <CardBody>
                    <div className="p-8 text-center">
                        <p className="text-lg font-bold">Loading policy data...</p>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>
                    Department Absence Policy
                    {department && <span className="ml-2 text-lg font-normal">- {department.name}</span>}
                </CardTitle>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardBody>
                    {/* General error message */}
                    {errors.general && (
                        <div className="p-4 mb-4 font-bold text-red-700 bg-red-100 border-3 border-red-700">
                            {errors.general}
                        </div>
                    )}

                    {/* Request settings */}
                    <div className="p-4 mb-6 border-3 border-black bg-blue-50">
                        <h3 className="text-lg font-bold mb-3">Request Settings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Minimum Days Notice"
                                name="minDaysNotice"
                                type="number"
                                min="0"
                                value={formData.minDaysNotice}
                                onChange={handleChange}
                                error={errors.minDaysNotice}
                                placeholder="0"
                            />

                            <Input
                                label="Max Consecutive Days"
                                name="maxConsecutiveDays"
                                type="number"
                                min="1"
                                value={formData.maxConsecutiveDays}
                                onChange={handleChange}
                                error={errors.maxConsecutiveDays}
                                placeholder="30"
                            />
                        </div>

                        <div className="mt-4">
                            <Input
                                label="Documentation Required After (days)"
                                name="documentationRequiredAfter"
                                type="number"
                                min="1"
                                value={formData.documentationRequiredAfter}
                                onChange={handleChange}
                                error={errors.documentationRequiredAfter}
                                placeholder="3"
                            />
                        </div>

                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                id="approvalRequired"
                                name="approvalRequired"
                                checked={formData.approvalRequired}
                                onChange={handleChange}
                                className="w-5 h-5 mr-2 border-3 border-black"
                            />
                            <label htmlFor="approvalRequired" className="font-bold">
                                Require manager approval for all requests
                            </label>
                        </div>
                    </div>

                    {/* Absence allowances */}
                    <div className="p-4 border-3 border-black bg-green-50">
                        <h3 className="text-lg font-bold mb-3">Annual Leave Allowances</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Max Vacation Days"
                                name="maxVacationDays"
                                type="number"
                                min="0"
                                value={formData.maxVacationDays}
                                onChange={handleChange}
                                error={errors.maxVacationDays}
                                placeholder="20"
                                className="bg-sky-50"
                            />

                            <Input
                                label="Max Sick Days"
                                name="maxSickDays"
                                type="number"
                                min="0"
                                value={formData.maxSickDays}
                                onChange={handleChange}
                                error={errors.maxSickDays}
                                placeholder="10"
                                className="bg-red-50"
                            />

                            <Input
                                label="Max Personal Days"
                                name="maxPersonalDays"
                                type="number"
                                min="0"
                                value={formData.maxPersonalDays}
                                onChange={handleChange}
                                error={errors.maxPersonalDays}
                                placeholder="3"
                                className="bg-purple-50"
                            />
                        </div>
                    </div>
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
                        {submitting ? 'Saving...' : 'Save Policy'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default DepartmentPolicyForm;