// src/services/authService.js
import api from './api';

// Constants for localStorage keys
const TOKEN_KEY = 'absence_token';
const USER_KEY = 'absence_user';

const authService = {
    /**
     * Login user with credentials
     * @param {Object} credentials - username and password
     * @returns {Promise} - resolves to user data with token
     */
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        // Correctly access token and user from the nested data object
        if (response.data && response.data.data && response.data.data.token) {
            localStorage.setItem(TOKEN_KEY, response.data.data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));
            return response.data.data;
        }
        return response.data;
    },

    /**
     * Register a new user
     * @param {Object} userData - user registration data
     * @returns {Promise} - resolves to registration result
     */
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Logout the current user
     */
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    /**
     * Get the current user from localStorage
     * @returns {Object|null} - user data or null if not logged in
     */
    getCurrentUser: () => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    /**
     * Get the auth token from localStorage
     * @returns {string|null} - token or null if not logged in
     */
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Check if the user is authenticated
     * @returns {boolean} - true if authenticated
     */
    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Update the stored user data (e.g. after profile update)
     * @param {Object} userData - updated user data
     */
    updateUserData: (userData) => {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
    }
};

export default authService;