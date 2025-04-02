// src/components/common/Modal.jsx
import React, { useEffect } from 'react';
import Button from './Button';

const Modal = ({
                   isOpen,
                   onClose,
                   title,
                   children,
                   footer,
                   size = 'md',
                   className = '',
               }) => {
    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className={`
          p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
          ${sizeClasses[size] || sizeClasses.md}
          w-full animate-pop
          ${className}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b-3 border-black">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-2xl font-bold hover:opacity-70"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[70vh] overflow-y-auto">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="flex justify-end pt-4 mt-4 border-t-3 border-black space-x-2">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export const ConfirmModal = ({
                                 isOpen,
                                 onClose,
                                 onConfirm,
                                 title = 'Confirm Action',
                                 message = 'Are you sure you want to proceed?',
                                 confirmText = 'Confirm',
                                 cancelText = 'Cancel',
                                 variant = 'danger',
                             }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button variant={variant} onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </>
            }
        >
            <p>{message}</p>
        </Modal>
    );
};

export default Modal;