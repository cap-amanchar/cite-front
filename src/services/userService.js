// src/services/userService.js
import api from './api';

const userService = {
    /**
     * Get current user profile
     * @returns {Promise} - Resolves to current user data
     */
    getCurrentUser: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },

    /**
     * Update current user profile
     * @param {Object} userData - User data to update
     * @returns {Promise} - Resolves to updated user data
     */
    updateCurrentUser: async (userData) => {
        const response = await api.put('/users/me', userData);
        return response.data;
    },

    /**
     * Get all users (admin only)
     * @param {Object} filters - Optional filters
     * @returns {Promise} - Resolves to users data
     */
    getAllUsers: async (filters = {}) => {
        const params = new URLSearchParams();

        // Add filters to query params
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                params.append(key, filters[key]);
            }
        });

        const response = await api.get(`/users?${params.toString()}`);
        return response.data;
    },

    /**
     * Get user by ID (admin only)
     * @param {string|number} id - User ID
     * @returns {Promise} - Resolves to user data
     */
    getUserById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    /**
     * Create a new user (admin only)
     * @param {Object} userData - User data for creation
     * @returns {Promise} - Resolves to created user data
     */
    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    /**
     * Update a user (admin only)
     * @param {string|number} id - User ID
     * @param {Object} userData - User data to update
     * @returns {Promise} - Resolves to updated user data
     */
    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    /**
     * Delete a user (admin only)
     * @param {string|number} id - User ID
     * @returns {Promise} - Resolves to deletion result
     */
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

export default userService;