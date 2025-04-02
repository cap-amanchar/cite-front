// src/components/users/UserList.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardBody } from '../common/Card';
import Button from '../common/Button';
import Select from '../common/Select';
import Input from '../common/Input';
import userService from '../../services/userService';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    // Filters
    const [filters, setFilters] = useState({
        role: '',
        department: '',
        status: '',
        search: ''
    });

    // Filter options
    const [departments, setDepartments] = useState([]);

    // Load users with filters
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await userService.getAllUsers({
                ...filters,
                limit: itemsPerPage,
                offset: (currentPage - 1) * itemsPerPage
            });

            setUsers(response.data.users || []);

            // Calculate total pages
            const totalItems = response.data.count || 0;
            setTotalPages(Math.ceil(totalItems / itemsPerPage));
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load departments for filter
    const fetchDepartments = async () => {
        try {
            // In a real app, this would be an API call
            // For now, using mock data
            setDepartments([
                { value: '1', label: 'Human Resources' },
                { value: '2', label: 'Engineering' },
                { value: '3', label: 'Marketing' },
                { value: '4', label: 'Finance' },
                { value: '5', label: 'Sales' }
            ]);
        } catch (err) {
            console.error('Error fetching departments:', err);
        }
    };

    // Load initial data
    useEffect(() => {
        fetchUsers();
        fetchDepartments();
    }, []);

    // Reload when page or filters change
    useEffect(() => {
        fetchUsers();
    }, [currentPage, filters]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters(prev => ({
            ...prev,
            [name]: value
        }));

        // Reset to first page when filters change
        setCurrentPage(1);
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            role: '',
            department: '',
            status: '',
            search: ''
        });

        setCurrentPage(1);
    };

    // Handle search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    // Get badge color for user role
    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-200 border-purple-500';
            case 'manager':
                return 'bg-blue-200 border-blue-500';
            case 'employee':
                return 'bg-green-200 border-green-500';
            default:
                return 'bg-gray-200 border-gray-500';
        }
    };

    // Get badge color for user status
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-200 border-green-500';
            case 'inactive':
                return 'bg-red-200 border-red-500';
            default:
                return 'bg-gray-200 border-gray-500';
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex flex-wrap items-center justify-between">
                    <CardTitle>User Management</CardTitle>

                    <Link href="/users/new">
                        <Button>
                            <span className="mr-1">+</span> New User
                        </Button>
                    </Link>
                </div>
            </CardHeader>

            <CardBody>
                {/* Filters */}
                <div className="p-4 mb-4 border-3 border-black bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Role filter */}
                        <Select
                            label="Role"
                            name="role"
                            value={filters.role}
                            onChange={handleFilterChange}
                            options={[
                                { value: 'admin', label: 'Admin' },
                                { value: 'manager', label: 'Manager' },
                                { value: 'employee', label: 'Employee' }
                            ]}
                            placeholder="All Roles"
                        />

                        {/* Department filter */}
                        <Select
                            label="Department"
                            name="department"
                            value={filters.department}
                            onChange={handleFilterChange}
                            options={departments}
                            placeholder="All Departments"
                        />

                        {/* Status filter */}
                        <Select
                            label="Status"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' }
                            ]}
                            placeholder="All Statuses"
                        />

                        {/* Search */}
                        <div>
                            <form onSubmit={handleSearchSubmit}>
                                <Input
                                    label="Search"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Name, email, username"
                                />
                            </form>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="secondary"
                            onClick={clearFilters}
                            className="border-gray-700 bg-white"
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="p-4 mb-4 font-bold text-red-700 bg-red-100 border-3 border-red-700">
                        {error}
                    </div>
                )}

                {/* Users table */}
                {loading ? (
                    <div className="p-8 text-center">
                        <p className="text-lg font-bold">Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center border-3 border-dashed border-gray-300">
                        <p className="text-lg font-bold mb-2">No users found</p>
                        <p className="text-gray-500">
                            Try adjusting your filters or create a new user.
                        </p>

                        <div className="mt-4">
                            <Link href="/users/new">
                                <Button>Create New User</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-gray-100 border-b-3 border-black">
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email / Username</th>
                                <th className="px-4 py-2 text-left">Department</th>
                                <th className="px-4 py-2 text-center">Role</th>
                                <th className="px-4 py-2 text-center">Status</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr
                                    key={user.id}
                                    className="border-b-2 border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 font-bold">
                                        {user.full_name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>{user.email}</div>
                                        <div className="text-sm text-gray-600">{user.username}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {user.department_name || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 text-xs font-bold border-2 ${getRoleBadgeColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 text-xs font-bold border-2 ${getStatusBadgeColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Link href={`/users/${user.id}`}>
                                            <Button size="sm" variant="secondary">View</Button>
                                        </Link>

                                        <Link href={`/users/${user.id}/edit`} className="ml-2">
                                            <Button size="sm" variant="info">Edit</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && users.length > 0 && (
                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            Showing {Math.min(users.length, itemsPerPage)} of {users.length} results
                        </div>

                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>

                            <span className="px-4 py-2 font-bold border-3 border-black bg-white">
                {currentPage} of {totalPages}
              </span>

                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

export default UserList;