// src/components/absences/AbsenceBoard.jsx
import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import AbsenceColumn from './AbsenceColumn';
import AbsenceDetails from './AbsenceDetails';
import Button from '../common/Button';
import Select from '../common/Select';
import Input from '../common/Input';
import absenceService from '../../services/absenceService';
import { useAuth } from '../../context/AuthContext';

const AbsenceBoard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Columns for the Kanban board
    const [columns, setColumns] = useState({
        pending: {
            id: 'pending',
            title: 'Pending',
            items: []
        },
        approved: {
            id: 'approved',
            title: 'Approved',
            items: []
        },
        rejected: {
            id: 'rejected',
            title: 'Rejected',
            items: []
        },
        cancelled: {
            id: 'cancelled',
            title: 'Cancelled',
            items: []
        }
    });

    // Filters
    const [filters, setFilters] = useState({
        departmentId: '',
        employeeId: '',
        type: '',
        startDate: '',
        endDate: ''
    });

    // Modal state
    const [selectedAbsence, setSelectedAbsence] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Filter options
    const [filterOptions, setFilterOptions] = useState({
        departments: [],
        employees: []
    });

    // Fetch absences and populate columns
    const fetchAbsences = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await absenceService.getAllAbsences(filters);

            // Reset columns
            const newColumns = {
                pending: { ...columns.pending, items: [] },
                approved: { ...columns.approved, items: [] },
                rejected: { ...columns.rejected, items: [] },
                cancelled: { ...columns.cancelled, items: [] }
            };

            // Populate columns
            response.data.requests.forEach(absence => {
                if (newColumns[absence.status]) {
                    newColumns[absence.status].items.push(absence);
                }
            });

            setColumns(newColumns);
        } catch (err) {
            setError('Failed to load absence requests. Please try again.');
            console.error('Error fetching absences:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load filter options (departments, employees)
    const loadFilterOptions = async () => {
        // This would be replaced with actual API calls
        // For now, using mock data
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
    };

    // Initial load
    useEffect(() => {
        fetchAbsences();
        loadFilterOptions();
    }, []);

    // Reload when filters change
    useEffect(() => {
        fetchAbsences();
    }, [filters]);

    // Handle drag end (status change)
    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        // Dropped outside a droppable area
        if (!destination) return;

        // Dropped in the same place
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // If dropping in a different column (status change)
        if (source.droppableId !== destination.droppableId) {
            // Get the absence ID
            const absenceId = draggableId;

            // Get the new status
            const newStatus = destination.droppableId;

            // Only managers/admins can change status
            if (user.role !== 'manager' && user.role !== 'admin') {
                return;
            }

            // Update the UI optimistically
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];

            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];

            // Remove from source
            const [movedItem] = sourceItems.splice(source.index, 1);

            // Add to destination
            destItems.splice(destination.index, 0, { ...movedItem, status: newStatus });

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });

            try {
                // Process the absence (approve/reject)
                if (newStatus === 'approved' || newStatus === 'rejected') {
                    await absenceService.processAbsence(
                        absenceId,
                        newStatus === 'approved' ? 'approve' : 'reject'
                    );
                }
                // Cancel the absence
                else if (newStatus === 'cancelled') {
                    await absenceService.cancelAbsence(absenceId);
                }
                // Other status changes not allowed (revert UI)
                else {
                    // Reload the board
                    fetchAbsences();
                }
            } catch (err) {
                console.error('Error updating absence status:', err);

                // Revert UI on error
                fetchAbsences();
            }
        } else {
            // Reordering within the same column
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];

            // Remove the item from the source
            const [movedItem] = copiedItems.splice(source.index, 1);

            // Insert at the destination
            copiedItems.splice(destination.index, 0, movedItem);

            // Update the column
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };

    // Handle opening absence details
    const handleAbsenceClick = (absence) => {
        setSelectedAbsence(absence);
        setIsDetailsModalOpen(true);
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            departmentId: '',
            employeeId: '',
            type: '',
            startDate: '',
            endDate: ''
        });
    };

    // Refresh board data
    const refreshBoard = () => {
        fetchAbsences();
    };

    return (
        <div className="h-full">
            <div className="flex flex-col h-full">
                {/* Board header */}
                <div className="mb-4">
                    <h1 className="mb-4 text-2xl font-bold">Absence Board</h1>

                    {/* Filters */}
                    <div className="p-4 mb-4 border-3 border-black bg-gray-50">
                        <div className="flex flex-wrap items-end gap-4">
                            {/* Department filter (for admins) */}
                            {user.role === 'admin' && (
                                <div className="w-48">
                                    <Select
                                        label="Department"
                                        name="departmentId"
                                        value={filters.departmentId}
                                        onChange={handleFilterChange}
                                        options={filterOptions.departments}
                                        placeholder="All Departments"
                                    />
                                </div>
                            )}

                            {/* Employee filter */}
                            <div className="w-48">
                                <Select
                                    label="Employee"
                                    name="employeeId"
                                    value={filters.employeeId}
                                    onChange={handleFilterChange}
                                    options={filterOptions.employees}
                                    placeholder="All Employees"
                                />
                            </div>

                            {/* Absence type filter */}
                            <div className="w-40">
                                <Select
                                    label="Absence Type"
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
                            </div>

                            {/* Date range filters */}
                            <div className="w-40">
                                <Input
                                    label="From Date"
                                    name="startDate"
                                    type="date"
                                    value={filters.startDate}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="w-40">
                                <Input
                                    label="To Date"
                                    name="endDate"
                                    type="date"
                                    value={filters.endDate}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            {/* Action buttons */}
                            <div className="flex ml-auto space-x-2">
                                <Button
                                    variant="secondary"
                                    onClick={clearFilters}
                                    className="border-gray-700 bg-white"
                                >
                                    Clear Filters
                                </Button>

                                <Button onClick={refreshBoard}>
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="p-4 mb-4 font-bold text-red-700 bg-red-100 border-3 border-red-700">
                        {error}
                    </div>
                )}

                {/* Board columns */}
                <div className="flex-1 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-lg font-bold">Loading absences...</div>
                        </div>
                    ) : (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="flex h-full gap-4 pb-4 overflow-x-auto">
                                {Object.values(columns).map(column => (
                                    <AbsenceColumn
                                        key={column.id}
                                        column={column}
                                        onAbsenceClick={handleAbsenceClick}
                                        userRole={user?.role}
                                    />
                                ))}
                            </div>
                        </DragDropContext>
                    )}
                </div>
            </div>

            {/* Absence details modal */}
            {selectedAbsence && (
                <AbsenceDetails
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    absenceId={selectedAbsence.id}
                    onStatusChange={refreshBoard}
                />
            )}
        </div>
    );
};

export default AbsenceBoard;