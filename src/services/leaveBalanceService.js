// src/services/leaveBalanceService.js
import api from './api';

const leaveBalanceService = {
    /**
     * Get current employee's leave balance
     * @param {number} year - Optional year (defaults to current year)
     * @returns {Promise} - Resolves to current employee's leave balance
     */
    getCurrentBalance: async (year = new Date().getFullYear()) => {
        const response = await api.get(`/leave-balances/me?year=${year}`);
        return response.data;
    },

    /**
     * Get leave balance for a specific employee (managers and admins only)
     * @param {string|number} employeeId - Employee ID
     * @param {number} year - Optional year (defaults to current year)
     * @returns {Promise} - Resolves to employee's leave balance
     */
    getEmployeeBalance: async (employeeId, year = new Date().getFullYear()) => {
        const response = await api.get(`/leave-balances/${employeeId}?year=${year}`);
        return response.data;
    },

    /**
     * Get team leave balances (for all employees in manager's team)
     * @param {Object} filters - Optional filters (departmentId, etc.)
     * @returns {Promise} - Resolves to team leave balances
     */
    getTeamBalances: async (filters = {}) => {
        const params = new URLSearchParams();

        // Add filters to query params
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                params.append(key, filters[key]);
            }
        });

        const response = await api.get(`/leave-balances/team?${params.toString()}`);
        return response.data;
    },

    /**
     * Update employee leave balance (admin only)
     * @param {string|number} employeeId - Employee ID
     * @param {Object} balanceData - Updated balance data
     * @returns {Promise} - Resolves to updated balance
     */
    updateEmployeeBalance: async (employeeId, balanceData) => {
        const response = await api.put(`/leave-balances/${employeeId}`, balanceData);
        return response.data;
    }
};

export default leaveBalanceService;