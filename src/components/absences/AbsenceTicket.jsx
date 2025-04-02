// src/components/absences/AbsenceTicket.jsx
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { StatusBadge, TypeBadge } from '../common/Badge';

// Absence type colors
const TYPE_COLORS = {
    vacation: 'bg-sky-100 border-sky-500',
    sick: 'bg-red-100 border-red-500',
    personal: 'bg-purple-100 border-purple-500'
};

// Format date in a readable way
const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
};

// Calculate the number of days between two dates
const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date
    return diffDays;
};

const AbsenceTicket = ({ absence, index, onClick, isDraggable = true }) => {
    const days = calculateDays(absence.start_date, absence.end_date);

    return (
        <Draggable
            draggableId={absence.id.toString()}
            index={index}
            isDragDisabled={!isDraggable}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`
            p-3 bg-white border-3 border-black cursor-pointer 
            ${snapshot.isDragging ? 'shadow-lg' : 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'}
            ${TYPE_COLORS[absence.type] || 'bg-gray-100'}
            hover:-translate-y-1 transition-transform
          `}
                    onClick={onClick}
                >
                    {/* Ticket header */}
                    <div className="flex items-center justify-between mb-2">
                        <TypeBadge type={absence.type} />
                        <StatusBadge status={absence.status} />
                    </div>

                    {/* Employee name */}
                    <h4 className="mb-1 font-bold truncate">{absence.employee_name}</h4>

                    {/* Department */}
                    <div className="mb-2 text-sm text-gray-600 truncate">
                        {absence.department_name}
                    </div>

                    {/* Date range */}
                    <div className="flex items-center justify-between p-1 mb-2 text-sm bg-white border-2 border-black">
                        <div className="font-bold">
                            {formatDate(absence.start_date)}
                        </div>

                        <div className="text-gray-500">
                            {days > 1 ? `${days} days` : '1 day'}
                        </div>

                        <div className="font-bold">
                            {formatDate(absence.end_date)}
                        </div>
                    </div>

                    {/* Documentation indicator */}
                    {absence.has_documentation && (
                        <div className="mb-1 text-xs text-right">
              <span className="px-1 bg-blue-100 border border-blue-500 rounded">
                Documentation provided
              </span>
                        </div>
                    )}

                    {/* Submission time */}
                    <div className="text-xs text-gray-500">
                        Submitted: {new Date(absence.submission_time).toLocaleString()}
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default AbsenceTicket;