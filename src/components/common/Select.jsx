// src/components/common/Select.jsx
import React from 'react';

const Select = ({
                    label,
                    name,
                    options = [],
                    value,
                    onChange,
                    placeholder = 'Select an option',
                    error,
                    required = false,
                    disabled = false,
                    className = '',
                    ...props
                }) => {
    return (
        <div className="mb-4 w-full">
            {label && (
                <label htmlFor={name} className="block mb-2 font-bold">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`
          w-full px-3 py-2 border-3 border-black
          ${disabled ? 'bg-gray-100 opacity-70' : 'bg-white'}
          ${error ? 'border-red-500' : 'focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
          transition-shadow appearance-none
          ${className}
        `}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Select;