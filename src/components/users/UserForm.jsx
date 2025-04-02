// src/components/users/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import userService from '../../services/userService';
import departmentService from '../../services/departmentService';

const UserForm = ({ initialData = null, isEdit = false }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        email: '',
        phone: '',
        role: '',
        departmentId: '',
        position: '',
        managerId: '',
        status: 'active'
    });

    const [departments, setDepartments] = useState([]);
    const [managers, setManagers] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [roleSpecificFieldsVisible, setRoleSpecificFieldsVisible] = useState(false);

    // Load departments and managers for dropdowns
    const fetchDepartmentsAndManagers = async () => {
        try {
            // Fetch departments
            const departmentsResponse = await departmentService.getAllDepartments();

            const departmentOptions = (departmentsResponse.data.departments || [])
                .map(dept => ({
                    value: dept.id.toString(),
                    label: dept.name
                }));

            setDepartments(departmentOptions);

            // Fetch managers
            const managersResponse = await userService.getAllUsers({ role: 'manager' });

            const managerOptions = (managersResponse.data.users || [])
                .map(user => ({
                    value: user.id.toString(),
                    label: user.full_name
                }));

            setManagers(managerOptions);
        } catch (err) {
            console.error('Error fetching departments or managers:', err);
        }
    };

    // Load initial data for edit mode
    useEffect(() => {
        fetchDepartmentsAndManagers();

        if (isEdit && initialData) {
            const userData = {
                username: initialData.username || '',
                fullName: initialData.full_name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                role: initialData.role || '',
                departmentId: initialData.department_id ? initialData.department_id.toString() : '',
                position: initialData.position || '',
                managerId: initialData.manager_id ? initialData.manager_id.toString() : '',
                status: initialData.status || 'active',
                // Don't set password fields in edit mode
                password: '',
                confirmPassword: ''
            };

            setFormData(userData);
            setRoleSpecificFieldsVisible(true);
        }
    }, [isEdit, initialData]);

    // Show/hide role specific fields when role changes
    useEffect(() => {
        if (formData.role) {
            setRoleSpecificFieldsVisible(true);
        }
    }, [formData.role]);

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

        // Required fields for all users
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!isEdit) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        } else if (formData.password && formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (formData.password && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.role) {
            newErrors.role = 'Role is required';
        }

        // Required fields for employees and managers
        if ((formData.role === 'employee' || formData.role === 'manager') && !formData.departmentId) {
            newErrors.departmentId = 'Department is required';
        }

        // Required fields for employees
        if (formData.role === 'employee' && !formData.position.trim()) {
            newErrors.position = 'Position is required';
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
            const userData = {
                username: formData.username,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone || undefined,
                role: formData.role
            };

            // Add password only if provided (required for new users)
            if (formData.password) {
                userData.password = formData.password;
            }

            // Add role-specific fields
            if (formData.role === 'employee' || formData.role === 'manager') {
                userData.departmentId = parseInt(formData.departmentId);
            }

            if (formData.role === 'employee') {
                userData.position = formData.position;
                if (formData.managerId) {
                    userData.managerId = parseInt(formData.managerId);
                }
            }

            if (isEdit) {
                userData.status = formData.status;
                await userService.updateUser(initialData.id, userData);
            } else {
                await userService.createUser(userData);
            }

            router.push('/users');
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                `Failed to ${isEdit ? 'update' : 'create'} user. Please try again.`;

            setErrors({
                ...errors,
                general: errorMessage
            });

            console.error(`Error ${isEdit ? 'updating' : 'creating'} user:`, err);
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
                    {isEdit ? 'Edit User' : 'New User'}
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

                    <div className="p-4 mb-6 border-3 border-black bg-gray-50">
                        <h3 className="text-lg font-bold mb-3">Basic Information</h3>

                        {/* Username */}
                        <Input
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={errors.username}
                            disabled={isEdit} // Cannot change username when editing
                            required
                        />

                        {/* Password fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label={isEdit ? "New Password (leave blank to keep current)" : "Password"}
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                required={!isEdit}
                            />

                            <Input
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                required={!isEdit && formData.password}
                            />
                        </div>

                        {/* Full name and email */}
                        <Input
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            error={errors.fullName}
                            required
                        />

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            required
                        />

                        {/* Phone (optional) */}
                        <Input
                            label="Phone (optional)"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g. +1 (555) 123-4567"
                        />

                        {/* Role select */}
                        <Select
                            label="User Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            options={[
                                { value: 'admin', label: 'Administrator' },
                                { value: 'manager', label: 'Manager' },
                                { value: 'employee', label: 'Employee' }
                            ]}
                            placeholder="Select user role"
                            error={errors.role}
                            disabled={isEdit} // Cannot change role when editing
                            required
                        />

                        {/* User status (edit only) */}
                        {isEdit && (
                            <Select
                                label="User Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' }
                                ]}
                            />
                        )}
                    </div>

                    {/* Role-specific fields */}
                    {roleSpecificFieldsVisible && (
                        <div className="p-4 border-3 border-black bg-blue-50">
                            <h3 className="text-lg font-bold mb-3">
                                {formData.role === 'employee' ? 'Employee Information' :
                                    formData.role === 'manager' ? 'Manager Information' :
                                        'Administrator Information'}
                            </h3>

                            {/* Department (for employees and managers) */}
                            {(formData.role === 'employee' || formData.role === 'manager') && (
                                <Select
                                    label="Department"
                                    name="departmentId"
                                    value={formData.departmentId}
                                    onChange={handleChange}
                                    options={departments}
                                    placeholder="Select department"
                                    error={errors.departmentId}
                                    required
                                />
                            )}

                            {/* Position (for employees) */}
                            {formData.role === 'employee' && (
                                <Input
                                    label="Position"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    placeholder="e.g. Software Developer"
                                    error={errors.position}
                                    required
                                />
                            )}

                            {/* Manager (for employees) */}
                            {formData.role === 'employee' && (
                                <Select
                                    label="Manager (optional)"
                                    name="managerId"
                                    value={formData.managerId}
                                    onChange={handleChange}
                                    options={managers}
                                    placeholder="Select manager"
                                />
                            )}
                        </div>
                    )}
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
                        {submitting ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default UserForm;