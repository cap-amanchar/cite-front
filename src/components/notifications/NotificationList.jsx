// src/components/notifications/NotificationList.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardBody } from '../common/Card';
import Button from '../common/Button';
import notificationService from '../../services/notificationService';

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load notifications
    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await notificationService.getUserNotifications();
            setNotifications(response.data.notifications || []);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Failed to load notifications. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchNotifications();
    }, []);

    // Mark notification as read
    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);

            // Update local state
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === id
                        ? { ...notification, status: 'read', read_date: new Date().toISOString() }
                        : notification
                )
            );
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    // Mark all as read
    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();

            // Update local state
            setNotifications(prev =>
                prev.map(notification => ({
                    ...notification,
                    status: 'read',
                    read_date: notification.read_date || new Date().toISOString()
                }))
            );
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    // Delete notification
    const handleDelete = async (id) => {
        try {
            await notificationService.deleteNotification(id);

            // Update local state
            setNotifications(prev => prev.filter(notification => notification.id !== id));
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000);
        const diffDays = Math.round(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'approval_request':
                return (
                    <div className="flex items-center justify-center w-10 h-10 bg-amber-100 border-2 border-black rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'request_approved':
                return (
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 border-2 border-black rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
            case 'request_rejected':
                return (
                    <div className="flex items-center justify-center w-10 h-10 bg-red-100 border-2 border-black rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
            case 'request_cancelled':
                return (
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 border-2 border-black rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 border-2 border-black rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex flex-wrap items-center justify-between">
                    <CardTitle>Notifications</CardTitle>

                    {notifications.length > 0 && notifications.some(n => n.status === 'unread') && (
                        <Button
                            variant="secondary"
                            onClick={handleMarkAllAsRead}
                        >
                            Mark All as Read
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardBody>
                {/* Error message */}
                {error && (
                    <div className="p-4 mb-4 font-bold text-red-700 bg-red-100 border-3 border-red-700">
                        {error}
                    </div>
                )}

                {/* Notifications list */}
                {loading ? (
                    <div className="p-8 text-center">
                        <p className="text-lg font-bold">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center border-3 border-dashed border-gray-300">
                        <p className="text-lg font-bold mb-2">No notifications</p>
                        <p className="text-gray-500">
                            You don't have any notifications at the moment.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`p-4 border-3 border-black ${
                                    notification.status === 'unread'
                                        ? 'bg-yellow-50'
                                        : 'bg-gray-50'
                                }`}
                            >
                                <div className="flex">
                                    <div className="mr-4">
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className="flex-1">
                                        <div className="mb-1 font-bold">
                                            {notification.content}
                                        </div>

                                        <div className="text-sm text-gray-600">
                                            {formatDate(notification.sent_date)}
                                        </div>

                                        {notification.request_id && (
                                            <div className="mt-2">
                                                <Link href={`/absences/${notification.request_id}`}>
                                                    <Button size="sm" variant="info">
                                                        View Request
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        {notification.status === 'unread' && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleMarkAsRead(notification.id)}
                                            >
                                                Mark Read
                                            </Button>
                                        )}

                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleDelete(notification.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

export default NotificationList;