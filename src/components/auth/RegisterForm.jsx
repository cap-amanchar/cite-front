// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Card from '../common/Card';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        email: '',
        phone: '',
        departmentId: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Instead of fetching from API, use hardcoded departments for register page
    // This avoids the authentication issue when trying to access /api/departments
    const departments = [
        { value: '1', label: 'Human Resources' },
        { value: '2', label: 'Engineering' },
        { value: '3', label: 'Marketing' },
        { value: '4', label: 'Finance' },
        { value: '5', label: 'Sales' }
    ];

    const { register } = useAuth();
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear errors when typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
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

        if (!formData.departmentId) {
            newErrors.departmentId = 'Department is required';
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
            await register({
                username: formData.username,
                password: formData.password,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone || undefined,
                departmentId: parseInt(formData.departmentId)
            });

            // Login redirect is handled in AuthContext
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'Registration failed. Please try again.';

            setErrors({
                ...errors,
                general: errorMessage
            });

            console.error('Registration error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <Card className="p-6">
                <h1 className="mb-6 text-3xl font-bold text-center">Register</h1>

                {/* General error message */}
                {errors.general && (
                    <div className="p-4 mb-4 font-bold text-red-800 bg-red-100 border-3 border-red-800">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={errors.username}
                        required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            required
                        />

                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            required
                        />
                    </div>

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

                    <Input
                        label="Phone (optional)"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +1 (555) 123-4567"
                    />

                    <Select
                        label="Department"
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleChange}
                        options={departments}
                        placeholder="Select your department"
                        error={errors.departmentId}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        className="mt-4"
                        disabled={submitting}
                    >
                        {submitting ? 'Registering...' : 'Register'}
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="font-bold underline hover:text-blue-700"
                    >
                        Login
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default RegisterForm;