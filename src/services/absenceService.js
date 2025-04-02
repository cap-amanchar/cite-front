// src/services/absenceService.js
import api from './api';

const absenceService = {
    /**
     * Get all absence requests (filtered based on user role)
     * @param {Object} filters - Optional filters (status, type, etc.)
     * @returns {Promise} - Resolves to an array of absence requests
     */
    getAllAbsences: async (filters = {}) => {
        const params = new URLSearchParams();

        // Add filters to query params
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                params.append(key, filters[key]);
            }
        });

        const response = await api.get(`/absences?${params.toString()}`);
        return response.data;
    },

    /**
     * Get absence request by ID
     * @param {string|number} id - Absence request ID
     * @returns {Promise} - Resolves to absence request data
     */
    getAbsenceById: async (id) => {
        const response = await api.get(`/absences/${id}`);
        return response.data;
    },

    /**
     * Create a new absence request
     * @param {Object} absenceData - Absence request data
     * @returns {Promise} - Resolves to created absence request
     */
    createAbsence: async (absenceData) => {
        const response = await api.post('/absences', absenceData);
        return response.data;
    },

    /**
     * Update an existing absence request
     * @param {string|number} id - Absence request ID
     * @param {Object} updateData - Updated absence data
     * @returns {Promise} - Resolves to updated absence request
     */
    updateAbsence: async (id, updateData) => {
        const response = await api.put(`/absences/${id}`, updateData);
        return response.data;
    },

    /**
     * Cancel an absence request
     * @param {string|number} id - Absence request ID
     * @returns {Promise} - Resolves to result of cancel operation
     */
    cancelAbsence: async (id) => {
        const response = await api.delete(`/absences/${id}`);
        return response.data;
    },

    /**
     * Process (approve/reject) an absence request
     * @param {string|number} id - Absence request ID
     * @param {string} action - 'approve' or 'reject'
     * @param {string} comments - Optional comments
     * @returns {Promise} - Resolves to result of process operation
     */
    processAbsence: async (id, action, comments = '') => {
        const response = await api.post(`/absences/${id}/process`, {
            action,
            comments
        });
        return response.data;
    }
};

export default absenceService;