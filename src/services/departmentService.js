// src/services/departmentService.js
import api from './api';

const departmentService = {
    /**
     * Get all departments
     * @returns {Promise} - Resolves to departments data
     */
    getAllDepartments: async () => {
        const response = await api.get('/departments');
        return response.data;
    },

    /**
     * Get department by ID
     * @param {string|number} id - Department ID
     * @returns {Promise} - Resolves to department data
     */
    getDepartmentById: async (id) => {
        const response = await api.get(`/departments/${id}`);
        return response.data;
    },

    /**
     * Create a new department (admin only)
     * @param {Object} departmentData - Department data
     * @returns {Promise} - Resolves to created department data
     */
    createDepartment: async (departmentData) => {
        const response = await api.post('/departments', departmentData);
        return response.data;
    },

    /**
     * Update a department (admin only)
     * @param {string|number} id - Department ID
     * @param {Object} departmentData - Department data to update
     * @returns {Promise} - Resolves to updated department data
     */
    updateDepartment: async (id, departmentData) => {
        const response = await api.put(`/departments/${id}`, departmentData);
        return response.data;
    },

    /**
     * Delete a department (admin only)
     * @param {string|number} id - Department ID
     * @param {Object} options - Delete options (e.g. transferToId)
     * @returns {Promise} - Resolves to deletion result
     */
    deleteDepartment: async (id, options = {}) => {
        const response = await api.delete(`/departments/${id}`, { data: options });
        return response.data;
    },

    /**
     * Get department absence policy
     * @param {string|number} id - Department ID
     * @returns {Promise} - Resolves to department policy
     */
    getDepartmentPolicy: async (id) => {
        const response = await api.get(`/departments/${id}/policy`);
        return response.data;
    },

    /**
     * Update department absence policy (admin only)
     * @param {string|number} id - Department ID
     * @param {Object} policyData - Policy data to update
     * @returns {Promise} - Resolves to updated policy
     */
    updateDepartmentPolicy: async (id, policyData) => {
        const response = await api.put(`/departments/${id}/policy`, policyData);
        return response.data;
    }
};

export default departmentService;