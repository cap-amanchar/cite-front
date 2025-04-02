// src/components/leave/LeaveBalanceForm.jsx
import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import leaveBalanceService from '../../services/leaveBalanceService';

const LeaveBalanceForm = ({ employeeId, initialData = null, onSuccess }) => {
    const currentYear = new Date().getFullYear();
    const [formData, setFormData] = useState({
        year: currentYear.toString(),
        vacationDays: '',
        sickDays: '',
        personalDays: ''
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [years, setYears] = useState([]);

    // Generate year options (current year and next year)
    useEffect(() => {
        const yearOptions = [];
        for (let y = currentYear - 1; y <= currentYear + 1; y++) {
            yearOptions.push({ value: y.toString(), label: y.toString() });
        }
        setYears(yearOptions);
    }, [currentYear]);

    // Load initial data if provided
    useEffect(() => {
        if (initialData) {
            setFormData({
                year: initialData.year?.toString() || currentYear.toString(),
                vacationDays: initialData.balance?.vacation?.toString() || '',
                sickDays: initialData.balance?.sick?.toString() || '',
                personalDays: initialData.balance?.personal?.toString() || ''
            });
        }
    }, [initialData, currentYear]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate numeric inputs
        if (['vacationDays', 'sickDays', 'personalDays'].includes(name)) {
            // Allow empty string or valid positive number
            if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

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

        if (!formData.year) {
            newErrors.year = 'Year is required';
        }

        // Validate days (allow empty for partial updates)
        if (formData.vacationDays && parseFloat(formData.vacationDays) < 0) {
            newErrors.vacationDays = 'Vacation days cannot be negative';
        }

        if (formData.sickDays && parseFloat(formData.sickDays) < 0) {
            newErrors.sickDays = 'Sick days cannot be negative';
        }

        if (formData.personalDays && parseFloat(formData.personalDays) < 0) {
            newErrors.personalDays = 'Personal days cannot be negative';
        }

        // Ensure at least one field is filled
        if (!formData.vacationDays && !formData.sickDays && !formData.personalDays) {
            newErrors.general = 'At least one balance field must be updated';
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
                year: parseInt(formData.year),
                vacationDays: formData.vacationDays ? parseFloat(formData.vacationDays) : undefined,
                sickDays: formData.sickDays ? parseFloat(formData.sickDays) : undefined,
                personalDays: formData.personalDays ? parseFloat(formData.personalDays) : undefined
            };

            await leaveBalanceService.updateEmployeeBalance(employeeId, requestData);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                'Failed to update leave balance. Please try again.';

            setErrors({
                ...errors,
                general: errorMessage
            });

            console.error('Error updating leave balance:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {initialData ? 'Update Leave Balance' : 'Set Leave Balance'}
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

                    {/* Year */}
                    <Select
                        label="Year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        options={years}
                        error={errors.year}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {/* Vacation days */}
                        <Input
                            label="Vacation Days"
                            name="vacationDays"
                            type="text"
                            value={formData.vacationDays}
                            onChange={handleChange}
                            error={errors.vacationDays}
                            className="bg-sky-50"
                        />

                        {/* Sick days */}
                        <Input
                            label="Sick Days"
                            name="sickDays"
                            type="text"
                            value={formData.sickDays}
                            onChange={handleChange}
                            error={errors.sickDays}
                            className="bg-red-50"
                        />

                        {/* Personal days */}
                        <Input
                            label="Personal Days"
                            name="personalDays"
                            type="text"
                            value={formData.personalDays}
                            onChange={handleChange}
                            error={errors.personalDays}
                            className="bg-purple-50"
                        />
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        <p>Note: Leave empty any field you don't want to update.</p>
                    </div>
                </CardBody>

                <CardFooter className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? 'Updating...' : 'Update Balance'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default LeaveBalanceForm;