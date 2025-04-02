// src/components/auth/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [loginError, setLoginError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    // Check if user just registered
    useEffect(() => {
        if (router.query.registered === 'true') {
            // Show success message
            const messageEl = document.getElementById('registration-message');
            if (messageEl) {
                messageEl.classList.remove('hidden');
                setTimeout(() => {
                    messageEl.classList.add('hidden');
                }, 5000);
            }
        }
    }, [router.query]);

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

        // Clear login error
        if (loginError) {
            setLoginError('');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
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
        setLoginError('');

        try {
            console.log('Submitting login form with data:', formData);
            await login(formData);
            // Navigation is handled in AuthContext
        } catch (error) {
            console.error('Login error in form:', error);
            setLoginError(
                error.response?.data?.message || 'Login failed. Please check your credentials.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <Card className="p-6">
                <h1 className="mb-6 text-3xl font-bold text-center">Login</h1>

                {/* Registration success message */}
                <div
                    id="registration-message"
                    className="p-4 mb-4 font-bold text-green-800 bg-green-100 border-3 border-green-800 hidden"
                >
                    Registration successful! Please log in with your new account.
                </div>

                {/* Login error message */}
                {loginError && (
                    <div className="p-4 mb-4 font-bold text-red-800 bg-red-100 border-3 border-red-800">
                        {loginError}
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

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        className="mt-4"
                        disabled={submitting}
                    >
                        {submitting ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    Don't have an account?{' '}
                    <Link
                        href="/register"
                        className="font-bold underline hover:text-blue-700"
                    >
                        Register
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default LoginForm;