// src/components/common/Input.jsx
import React from 'react';

const Input = ({
                   label,
                   name,
                   type = 'text',
                   placeholder,
                   value,
                   onChange,
                   error,
                   required = false,
                   disabled = false,
                   className = '',
                   fullWidth = true,
                   ...props
               }) => {
    return (
        <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label htmlFor={name} className="block mb-2 font-bold">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`
          w-full px-3 py-2 border-3 border-black
          ${disabled ? 'bg-gray-100 opacity-70' : 'bg-white'}
          ${error ? 'border-red-500' : 'focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
          transition-shadow
          ${className}
        `}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export const Textarea = ({
                             label,
                             name,
                             placeholder,
                             value,
                             onChange,
                             error,
                             required = false,
                             disabled = false,
                             rows = 4,
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
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                rows={rows}
                className={`
          w-full px-3 py-2 border-3 border-black
          ${disabled ? 'bg-gray-100 opacity-70' : 'bg-white'}
          ${error ? 'border-red-500' : 'focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
          transition-shadow
          ${className}
        `}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Input;