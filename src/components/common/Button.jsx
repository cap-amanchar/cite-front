import React from 'react';

const VARIANTS = {
    primary: 'bg-yellow-400',
    secondary: 'bg-orange-400',
    success: 'bg-emerald-400',
    danger: 'bg-red-400',
    info: 'bg-blue-400',
};

const SIZES = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
};

const Button = ({
                    children,
                    variant = 'primary',
                    size = 'md',
                    fullWidth = false,
                    disabled = false,
                    onClick,
                    className = '',
                    type = 'button',
                    ...props
                }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        font-bold border-3 border-black 
        ${VARIANTS[variant] || VARIANTS.primary}
        ${SIZES[size] || SIZES.md}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
        shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        transition-all 
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;