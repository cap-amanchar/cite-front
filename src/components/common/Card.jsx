// src/components/common/Card.jsx
import React from 'react';

const VARIANTS = {
    default: 'bg-white',
    primary: 'bg-yellow-100',
    secondary: 'bg-orange-100',
    info: 'bg-blue-100',
};

const Card = ({
                  children,
                  variant = 'default',
                  interactive = false,
                  className = '',
                  onClick,
                  ...props
              }) => {
    return (
        <div
            onClick={onClick}
            className={`
        p-4 border-3 border-black 
        ${VARIANTS[variant] || VARIANTS.default}
        ${interactive ? 'cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : ''}
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        transition-all
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '', ...props }) => {
    return (
        <div className={`mb-3 pb-3 border-b-2 border-black ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardTitle = ({ children, className = '', ...props }) => {
    return (
        <h3 className={`text-xl font-bold ${className}`} {...props}>
            {children}
        </h3>
    );
};

export const CardBody = ({ children, className = '', ...props }) => {
    return (
        <div className={`${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardFooter = ({ children, className = '', ...props }) => {
    return (
        <div className={`mt-3 pt-3 border-t-2 border-black ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;