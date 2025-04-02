// src/components/users/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';

const UserProfile = () => {
    const { user, updateUser } = useAuth();
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [userDetails, setUserDetails] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Load user data
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);

            try {
                // Get detailed user info
                const response = await userService.getCurrentUser();
                const userData = response.data;

                setUserDetails(userData);

                // Set form data
                setProfileData({
                    fullName: userData.full_name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } catch (err) {
                console.error('Error fetching user data:', err);
                setErrors({
                    general: 'Failed to load user profile. Please try again.'
                });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfileData(prev => ({
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

        // Clear success message when making changes
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!profileData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!profileData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Only validate password fields if trying to change password
        if (profileData.newPassword || profileData.currentPassword || profileData.confirmPassword) {
            if (!profileData.currentPassword) {
                newErrors.currentPassword = 'Current password is required to change password';
            }

            if (profileData.newPassword && profileData.newPassword.length < 8) {
                newErrors.newPassword = 'New password must be at least 8 characters';
            }

            if (profileData.newPassword !== profileData.confirmPassword) {
                newErrors.confirmPassword = 'New passwords do not match';
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
        setSuccessMessage('');

        try {
            const updateData = {
                fullName: profileData.fullName,
                email: profileData.email,
                phone: profileData.phone || undefined
            };

            // Add password fields only if trying to change password
            if (profileData.newPassword && profileData.currentPassword) {
                updateData.currentPassword = profileData.currentPassword;
                updateData.newPassword = profileData.newPassword;
            }

            const response = await userService.updateCurrentUser(updateData);

            // Update auth context with new user data
            if (updateUser) {
                updateUser({
                    ...user,
                    fullName: profileData.fullName,
                    email: profileData.email,
                    phone: profileData.phone
                });
            }

            // Clear password fields
            setProfileData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));

            setSuccessMessage('Profile updated successfully');
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                'Failed to update profile. Please try again.';

            if (err.response?.data?.message?.includes('password')) {
                setErrors({
                    ...errors,
                    currentPassword: 'Current password is incorrect'
                });
            } else {
                setErrors({
                    ...errors,
                    general: errorMessage
                });
            }

            console.error('Error updating profile:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Card className="max-w-3xl mx-auto">
                <CardBody>
                    <div className="p-8 text-center">
                        <p className="text-lg font-bold">Loading profile data...</p>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* User info summary card */}
            <Card className="bg-blue-50">
                <CardBody>
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-16 h-16 font-bold text-2xl text-white bg-blue-600 border-3 border-black rounded-full mr-4">
                            {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold">{profileData.fullName}</h2>
                            <div className="text-gray-600">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</div>

                            {userDetails?.department_name && (
                                <div className="mt-1 text-sm font-medium bg-white px-2 py-1 border-2 border-black inline-block">
                                    {userDetails.department_name}
                                    {userDetails.position && ` • ${userDetails.position}`}
                                </div>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Profile form */}
            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardBody>
                        {/* Success message */}
                        {successMessage && (
                            <div className="p-4 mb-4 font-bold text-green-700 bg-green-100 border-3 border-green-700">
                                {successMessage}
                            </div>
                        )}

                        {/* General error message */}
                        {errors.general && (
                            <div className="p-4 mb-4 font-bold text-red-700 bg-red-100 border-3 border-red-700">
                                {errors.general}
                            </div>
                        )}

                        <h3 className="text-lg font-bold mb-3">Basic Information</h3>

                        <Input
                            label="Full Name"
                            name="fullName"
                            value={profileData.fullName}
                            onChange={handleChange}
                            error={errors.fullName}
                            required
                        />

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleChange}
                            error={errors.email}
                            required
                        />

                        <Input
                            label="Phone (optional)"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleChange}
                            placeholder="e.g. +1 (555) 123-4567"
                        />

                        <div className="mt-8 mb-2">
                            <h3 className="text-lg font-bold mb-3">Change Password</h3>
                            <p className="text-sm text-gray-600 mb-4">Leave these fields blank if you don't want to change your password</p>

                            <Input
                                label="Current Password"
                                name="currentPassword"
                                type="password"
                                value={profileData.currentPassword}
                                onChange={handleChange}
                                error={errors.currentPassword}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    value={profileData.newPassword}
                                    onChange={handleChange}
                                    error={errors.newPassword}
                                />

                                <Input
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={profileData.confirmPassword}
                                    onChange={handleChange}
                                    error={errors.confirmPassword}
                                />
                            </div>
                        </div>
                    </CardBody>

                    <CardFooter className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default UserProfile;