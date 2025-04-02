// src/components/absences/AbsenceList.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardBody } from '../common/Card';
import Button from '../common/Button';
import Select from '../common/Select';
import Input from '../common/Input';
import { StatusBadge, TypeBadge } from '../common/Badge';
import absenceService from '../../services/absenceService';
import { useAuth } from '../../context/AuthContext';

const AbsenceList = () => {
    const { user } = useAuth();
    const [absences, setAbsences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    // Filters
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        startDate: '',
        endDate: '',
        employeeId: '',
        departmentId: ''
    });

    // Filter options (for selects)
    const [filterOptions, setFilterOptions] = useState({
        departments: [],
        employees: []
    });

    // Load absences with filters
    const fetchAbsences = async () => {
        setLoading(true);
        setError(null);

        try {
            // Build filter object
            const apiFilters = { ...filters };

            // Add pagination
            apiFilters.limit = itemsPerPage;
            apiFilters.offset = (currentPage - 1) * itemsPerPage;

            const response = await absenceService.getAllAbsences(apiFilters);

            setAbsences(response.data.requests || []);

            // Calculate total pages
            const totalItems = response.data.count || 0;
            setTotalPages(Math.ceil(totalItems / itemsPerPage));
        } catch (err) {
            console.error('Error fetching absences:', err);
            setError('Failed to load absence requests. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load initial data and set up filter options
    useEffect(() => {
        // Load filter options (would be API calls in a real app)
        setFilterOptions({
            departments: [
                { value: '1', label: 'Human Resources' },
                { value: '2', label: 'Engineering' },
                { value: '3', label: 'Marketing' },
                { value: '4', label: 'Finance' },
                { value: '5', label: 'Sales' }
            ],
            employees: [
                { value: '1', label: 'John Smith' },
                { value: '2', label: 'Jane Doe' },
                { value: '3', label: 'Bob Johnson' }
            ]
        });

        fetchAbsences();
    }, []);

    // Reload when page or filters change
    useEffect(() => {
        fetchAbsences();
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
            status: '',
            type: '',
            startDate: '',
            endDate: '',
            employeeId: '',
            departmentId: ''
        });

        setCurrentPage(1);
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    // Calculate days between two dates
    const calculateDays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
        return diffDays;
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex flex-wrap items-center justify-between">
                    <CardTitle>Absence Requests</CardTitle>

                    {/* Action button - only for employees */}
                    {user?.role === 'employee' && (
                        <Link href="/absences/new">
                            <Button>
                                <span className="mr-1">+</span> New Request
                            </Button>
                        </Link>
                    )}

                    {/* View board button - only for managers and admins */}
                    {(user?.role === 'manager' || user?.role === 'admin') && (
                        <Link href="/absences/board">
                            <Button variant="secondary">
                                View Board
                            </Button>
                        </Link>
                    )}
                </div>
            </CardHeader>

            <CardBody>
                {/* Filters */}
                <div className="p-4 mb-4 border-3 border-black bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {/* Status filter */}
                        <Select
                            label="Status"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            options={[
                                { value: 'pending', label: 'Pending' },
                                { value: 'approved', label: 'Approved' },
                                { value: 'rejected', label: 'Rejected' },
                                { value: 'cancelled', label: 'Cancelled' }
                            ]}
                            placeholder="All Statuses"
                        />

                        {/* Type filter */}
                        <Select
                            label="Type"
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            options={[
                                { value: 'vacation', label: 'Vacation' },
                                { value: 'sick', label: 'Sick Leave' },
                                { value: 'personal', label: 'Personal' }
                            ]}
                            placeholder="All Types"
                        />

                        {/* Date filters */}
                        <Input
                            label="From Date"
                            name="startDate"
                            type="date"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                        />

                        <Input
                            label="To Date"
                            name="endDate"
                            type="date"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                        />

                        {/* Additional filters for managers/admins */}
                        {(user?.role === 'manager' || user?.role === 'admin') && (
                            <>
                                <Select
                                    label="Employee"
                                    name="employeeId"
                                    value={filters.employeeId}
                                    onChange={handleFilterChange}
                                    options={filterOptions.employees}
                                    placeholder="All Employees"
                                />

                                {user?.role === 'admin' && (
                                    <Select
                                        label="Department"
                                        name="departmentId"
                                        value={filters.departmentId}
                                        onChange={handleFilterChange}
                                        options={filterOptions.departments}
                                        placeholder="All Departments"
                                    />
                                )}
                            </>
                        )}
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

                {/* Absences table */}
                {loading ? (
                    <div className="p-8 text-center">
                        <p className="text-lg font-bold">Loading absence requests...</p>
                    </div>
                ) : absences.length === 0 ? (
                    <div className="p-8 text-center border-3 border-dashed border-gray-300">
                        <p className="text-lg font-bold mb-2">No absence requests found</p>
                        <p className="text-gray-500">
                            {user?.role === 'employee'
                                ? "You haven't submitted any absence requests yet."
                                : "No absence requests match your filters."}
                        </p>

                        {user?.role === 'employee' && (
                            <div className="mt-4">
                                <Link href="/absences/new">
                                    <Button>Create New Request</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-gray-100 border-b-3 border-black">
                                <th className="px-4 py-2 text-left">Employee</th>
                                <th className="px-4 py-2 text-left">Type</th>
                                <th className="px-4 py-2 text-left">Dates</th>
                                <th className="px-4 py-2 text-center">Days</th>
                                <th className="px-4 py-2 text-center">Status</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {absences.map(absence => (
                                <tr
                                    key={absence.id}
                                    className="border-b-2 border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-bold">{absence.employee_name}</div>
                                        <div className="text-sm text-gray-600">{absence.department_name}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <TypeBadge type={absence.type} />
                                    </td>
                                    <td className="px-4 py-3">
                                        {formatDate(absence.start_date)} - {formatDate(absence.end_date)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {calculateDays(absence.start_date, absence.end_date)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge status={absence.status} />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Link href={`/absences/${absence.id}`}>
                                            <Button size="sm" variant="secondary">View</Button>
                                        </Link>

                                        {/* Show cancel button for pending requests */}
                                        {absence.status === 'pending' && (
                                            <Link href={`/absences/${absence.id}?action=cancel`} className="ml-2">
                                                <Button size="sm" variant="danger">Cancel</Button>
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && absences.length > 0 && (
                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            Showing {Math.min(absences.length, itemsPerPage)} of {absences.length} results
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

export default AbsenceList;