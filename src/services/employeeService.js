import api from './api';

/**
 * Employee Service
 * Handles all employee-related API calls
 */

const employeeService = {
  /**
   * Get all employees
   * @param {Object} params - Query parameters (store, isActive)
   * @returns {Promise} Response with employees
   */
  async getEmployees(params = {}) {
    const response = await api.get('/employees', { params });
    return response;
  },

  /**
   * Get employee by ID
   * @param {string} id - Employee ID
   * @returns {Promise} Response with employee data
   */
  async getEmployeeById(id) {
    const response = await api.get(`/employees/${id}`);
    return response;
  },

  /**
   * Create new employee
   * @param {Object} employeeData - Employee data
   * @returns {Promise} Response with created employee
   */
  async createEmployee(employeeData) {
    const response = await api.post('/employees', employeeData);
    return response;
  },

  /**
   * Update employee
   * @param {string} id - Employee ID
   * @param {Object} employeeData - Updated employee data
   * @returns {Promise} Response with updated employee
   */
  async updateEmployee(id, employeeData) {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response;
  },

  /**
   * Delete employee
   * @param {string} id - Employee ID
   * @returns {Promise} Response
   */
  async deleteEmployee(id) {
    const response = await api.delete(`/employees/${id}`);
    return response;
  },
};

export default employeeService;
