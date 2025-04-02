// src/components/layout/DebugWrapper.jsx
// Optional component for debugging auth issues
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const DebugWrapper = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [showDebug, setShowDebug] = useState(false);

    const toggleDebug = () => {
        setShowDebug(!showDebug);
    };

    return (
        <>
            {children}

            {/* Debug Panel - Only visible in development */}
            {process.env.NODE_ENV !== 'production' && (
                <div className="fixed bottom-2 right-2">
                    <button
                        onClick={toggleDebug}
                        className="bg-gray-800 text-white text-xs p-2 rounded-full"
                        title="Toggle Debug Panel"
                    >
                        D
                    </button>

                    {showDebug && (
                        <div className="fixed bottom-12 right-2 bg-gray-900 text-white p-4 rounded shadow-lg w-64 text-xs font-mono z-50">
                            <h4 className="font-bold mb-2">Auth Debug Info</h4>
                            <p>isAuthenticated: {String(isAuthenticated)}</p>
                            <p>User: {user ? user.username : 'none'}</p>
                            <p>Role: {user ? user.role : 'none'}</p>
                            <p>Token: {localStorage.getItem('absence_token') ? '✅ Present' : '❌ Missing'}</p>
                            <hr className="my-2 border-gray-700" />
                            <p className="text-gray-400 mt-2">Add this to MainLayout.jsx to debug auth issues</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default DebugWrapper;