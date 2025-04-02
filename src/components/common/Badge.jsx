// src/components/common/Badge.jsx
import React from 'react';

const VARIANTS = {
    primary: 'bg-yellow-300',
    secondary: 'bg-orange-300',
    success: 'bg-emerald-300',
    danger: 'bg-red-300',
    info: 'bg-blue-300',
    warning: 'bg-amber-300',
    gray: 'bg-gray-300',

    // Status-specific
    pending: 'bg-amber-300',
    approved: 'bg-emerald-300',
    rejected: 'bg-red-300',
    cancelled: 'bg-gray-300',

    // Type-specific
    vacation: 'bg-sky-200',
    sick: 'bg-red-200',
    personal: 'bg-purple-200',
};

const Badge = ({
                   children,
                   variant = 'primary',
                   outlined = false,
                   className = '',
                   ...props
               }) => {
    return (
        <span
            className={`
        inline-block px-2 py-1 text-xs font-bold border-2 border-black
        ${outlined ? 'bg-white' : VARIANTS[variant] || VARIANTS.primary}
        ${className}
      `}
            {...props}
        >
      {children}
    </span>
    );
};

// Utility components for common badge types
export const StatusBadge = ({ status }) => {
    const statusLabels = {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        cancelled: 'Cancelled',
    };

    return (
        <Badge variant={status} className="uppercase">
            {statusLabels[status] || status}
        </Badge>
    );
};

export const TypeBadge = ({ type }) => {
    const typeLabels = {
        vacation: 'Vacation',
        sick: 'Sick Leave',
        personal: 'Personal',
    };

    return (
        <Badge variant={type}>
            {typeLabels[type] || type}
        </Badge>
    );
};

export default Badge;