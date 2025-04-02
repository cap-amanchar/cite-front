// src/components/departments/DepartmentForm.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import departmentService from '../../services/departmentService';
import userService from '../../services/userService';

const DepartmentForm = ({ initialData = null, isEdit = false }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        managerId: '',
        location: ''
    });

    const [managers, setManagers] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Load managers for select dropdown
    const fetchManagers = async () => {
        try {
            // In a real app, this would use an API call to get only manager users
            // For now, we'll use the getAllUsers with a role filter
            const response = await userService.getAllUsers({ role: 'manager' });

            const managerOptions = (response.data.users || [])
                .map(user => ({
                    value: user.id.toString(),
                    label: user.full_name
                }));

            setManagers(managerOptions);
        } catch (err) {
            console.error('Error fetching managers:', err);
        }
    };

    // Load initial data for edit mode
    useEffect(() => {
        fetchManagers();

        if (isEdit && initialData) {
            setFormData({
                name: initialData.name || '',
                managerId: initialData.manager_id ? initialData.manager_id.toString() : '',
                location: initialData.location || ''
            });
        }
    }, [isEdit, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
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

        if (!formData.name.trim()) {
            newErrors.name = 'Department name is required';
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
            const departmentData = {
                name: formData.name,
                managerId: formData.managerId ? parseInt(formData.managerId) : null,
                location: formData.location || null
            };

            if (isEdit && initialData) {
                await departmentService.updateDepartment(initialData.id, departmentData);
            } else {
                await departmentService.createDepartment(departmentData);
            }

            router.push('/departments');
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                `Failed to ${isEdit ? 'update' : 'create'} department. Please try again.`;

            setErrors({
                ...errors,
                general: errorMessage
            });

            console.error(`Error ${isEdit ? 'updating' : 'creating'} department:`, err);
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
                <CardTitle>
                    {isEdit ? 'Edit Department' : 'New Department'}
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

                    {/* Department name */}
                    <Input
                        label="Department Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                    />

                    {/* Manager select */}
                    <Select
                        label="Department Manager"
                        name="managerId"
                        value={formData.managerId}
                        onChange={handleChange}
                        options={managers}
                        placeholder="Select a manager (optional)"
                    />

                    {/* Location */}
                    <Input
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Building, floor, etc. (optional)"
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
                        {submitting ? 'Saving...' : isEdit ? 'Update Department' : 'Create Department'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default DepartmentForm;