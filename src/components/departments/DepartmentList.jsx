// src/components/departments/DepartmentList.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardBody } from '../common/Card';
import Button from '../common/Button';
import departmentService from '../../services/departmentService';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch departments
    const fetchDepartments = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await departmentService.getAllDepartments();
            setDepartments(response.data.departments || []);
        } catch (err) {
            console.error('Error fetching departments:', err);
            setError('Failed to load departments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load initial data
    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex flex-wrap items-center justify-between">
                    <CardTitle>Departments</CardTitle>

                    <Link href="/departments/new">
                        <Button>
                            <span className="mr-1">+</span> New Department
                        </Button>
                    </Link>
                </div>
            </CardHeader>

            <CardBody>
                {/* Error message */}
                {error && (
                    <div className="p-4 mb-4 font-bold text-red-700 bg-red-100 border-3 border-red-700">
                        {error}
                    </div>
                )}

                {/* Departments table */}
                {loading ? (
                    <div className="p-8 text-center">
                        <p className="text-lg font-bold">Loading departments...</p>
                    </div>
                ) : departments.length === 0 ? (
                    <div className="p-8 text-center border-3 border-dashed border-gray-300">
                        <p className="text-lg font-bold mb-2">No departments found</p>
                        <p className="text-gray-500">
                            Create your first department to get started.
                        </p>

                        <div className="mt-4">
                            <Link href="/departments/new">
                                <Button>Create New Department</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-gray-100 border-b-3 border-black">
                                <th className="px-4 py-2 text-left">Department</th>
                                <th className="px-4 py-2 text-left">Manager</th>
                                <th className="px-4 py-2 text-center">Employees</th>
                                <th className="px-4 py-2 text-left">Location</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {departments.map(dept => (
                                <tr
                                    key={dept.id}
                                    className="border-b-2 border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 font-bold">
                                        {dept.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {dept.manager_name || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {dept.employee_count}
                                    </td>
                                    <td className="px-4 py-3">
                                        {dept.location || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Link href={`/departments/${dept.id}`}>
                                            <Button size="sm" variant="secondary">View</Button>
                                        </Link>

                                        <Link href={`/departments/${dept.id}/edit`} className="ml-2">
                                            <Button size="sm" variant="info">Edit</Button>
                                        </Link>

                                        <Link href={`/departments/${dept.id}/policy`} className="ml-2">
                                            <Button size="sm" variant="primary">Policy</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

export default DepartmentList;