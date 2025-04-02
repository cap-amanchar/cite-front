// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import authService from '../services/authService';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Initialize state from localStorage on mount
    useEffect(() => {
        const initAuth = () => {
            try {
                const currentUser = authService.getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                console.error('Failed to initialize auth state:', err);
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Login function
    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            console.log('Attempting login with credentials:', credentials);
            const response = await authService.login(credentials);
            console.log('Login response:', response);

            // Set user from response
            setUser(response.user);

            console.log('User set in context:', response.user);

            // Redirect based on user role
            if (response.user.role === 'admin') {
                router.push('/dashboard');
            } else if (response.user.role === 'manager') {
                router.push('/dashboard');
            } else {
                router.push('/dashboard');
            }

            return response;
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Failed to login');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.register(userData);
            // Don't auto-login after registration
            router.push('/login?registered=true');
            return response;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        authService.logout();
        setUser(null);
        router.push('/login');
    };

    // Update user data
    const updateUser = (userData) => {
        authService.updateUserData(userData);
        setUser(userData);
    };

    // Provide context
    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                register,
                logout,
                updateUser,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Hook for easy access to auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;