// src/components/absences/AbsenceColumn.jsx
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import AbsenceTicket from './AbsenceTicket';

const COLUMN_COLORS = {
    pending: 'bg-amber-100 border-amber-500',
    approved: 'bg-emerald-100 border-emerald-500',
    rejected: 'bg-red-100 border-red-500',
    cancelled: 'bg-gray-100 border-gray-500'
};

const AbsenceColumn = ({ column, onAbsenceClick, userRole }) => {
    // Check if column is droppable (only managers/admins can move tickets)
    const isDroppable = userRole === 'manager' || userRole === 'admin';

    return (
        <div className="flex flex-col flex-shrink-0 w-80">
            {/* Column header */}
            <div className={`p-3 mb-2 font-bold border-3 border-black ${COLUMN_COLORS[column.id] || 'bg-gray-100'}`}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg">{column.title}</h3>
                    <span className="flex items-center justify-center w-6 h-6 font-bold text-gray-800 bg-white border-2 border-gray-800 rounded-full">
            {column.items.length}
          </span>
                </div>
            </div>

            {/* Droppable area */}
            <Droppable droppableId={column.id} isDropDisabled={!isDroppable}>
                {(provided, snapshot) => (
                    <div
                        className={`flex-1 p-2 overflow-y-auto border-3 border-dashed ${
                            snapshot.isDraggingOver
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 bg-gray-50'
                        }`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {column.items.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                No requests
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {column.items.map((item, index) => (
                                    <AbsenceTicket
                                        key={item.id}
                                        absence={item}
                                        index={index}
                                        onClick={() => onAbsenceClick(item)}
                                        isDraggable={isDroppable}
                                    />
                                ))}
                            </div>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default AbsenceColumn;