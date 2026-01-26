import { createSlice } from '@reduxjs/toolkit';

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employees: [],
    stats: null,
    loading: false,
    error: null
  },
  reducers: {
    fetchEmployees: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEmployeesSuccess: (state, action) => {
      state.loading = false;
      state.employees = action.payload.data.map(emp => ({
        id: emp._id,
        employeeId: emp.employeeId || 'N/A',
        position: emp.position || 'N/A',
        department: emp.department || 'N/A',
        name: emp.user?.username || 'N/A',
        email: emp.user?.email || 'N/A',
        role: emp.user?.role || 'N/A',
        storeId: emp.store?._id,
        storeName: emp.store?.name,
        status: emp.user?.isActive ? 'Online' : 'Offline',
        active: emp.user?.isActive
      })) || [];
    },
    fetchEmployeesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    bulkCreateEmployees: (state) => {
      state.loading = true;
      state.error = null;
    },
    bulkCreateEmployeesSuccess: (state, action) => {
      state.loading = false;
      const newEmployees = action.payload.data.map(emp => ({
        id: emp._id,
        employeeId: emp.employeeId || 'N/A',
        position: emp.position || 'N/A',
        department: emp.department || 'N/A',
        name: emp.user?.username || 'N/A',
        email: emp.user?.email || 'N/A',
        role: emp.user?.role || 'N/A',
        storeId: emp.store?._id,
        storeName: emp.store?.name,
        status: emp.user?.isActive ? 'Online' : 'Offline',
        active: emp.user?.isActive
      }));
      state.employees = [...state.employees, ...newEmployees];
    },
    bulkCreateEmployeesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createEmployee: (state) => {
      state.loading = true;
      state.error = null;
    },
    createEmployeeSuccess: (state, action) => {
      state.loading = false;
      const emp = action.payload.data;
      state.employees.push({
        id: emp._id,
        employeeId: emp.employeeId || 'N/A',
        position: emp.position || 'N/A',
        department: emp.department || 'N/A',
        name: emp.user?.username || 'N/A',
        email: emp.user?.email || 'N/A',
        role: emp.user?.role || 'N/A',
        storeId: emp.store?._id,
        storeName: emp.store?.name,
        status: emp.user?.isActive ? 'Online' : 'Offline',
        active: emp.user?.isActive
      });
    },
    createEmployeeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateEmployee: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateEmployeeSuccess: (state, action) => {
      state.loading = false;
      const emp = action.payload.data;
      const index = state.employees.findIndex((e) => e.id === emp._id);
      if (index !== -1) {
        state.employees[index] = {
          id: emp._id,
          employeeId: emp.employeeId || 'N/A',
          position: emp.position || 'N/A',
          department: emp.department || 'N/A',
          name: emp.user?.username || 'N/A',
          email: emp.user?.email || 'N/A',
          role: emp.user?.role || 'N/A',
          storeId: emp.store?._id,
          storeName: emp.store?.name,
          status: emp.user?.isActive ? 'Online' : 'Offline',
          active: emp.user?.isActive
        };
      }
    },
    updateEmployeeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteEmployee: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteEmployeeSuccess: (state, action) => {
      state.loading = false;
      state.employees = state.employees.filter((e) => e.id !== action.payload.id);
    },
    deleteEmployeeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetPassword: (state) => {
      state.loading = true;
      state.error = null;
    },
    resetPasswordSuccess: (state) => {
      state.loading = false;
    },
    resetPasswordFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchStats: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStatsSuccess: (state, action) => {
      state.loading = false;
      state.stats = action.payload.data;
    },
    fetchStatsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchEmployees, fetchEmployeesSuccess, fetchEmployeesFail,
  bulkCreateEmployees, bulkCreateEmployeesSuccess, bulkCreateEmployeesFail,
  createEmployee, createEmployeeSuccess, createEmployeeFail,
  updateEmployee, updateEmployeeSuccess, updateEmployeeFail,
  deleteEmployee, deleteEmployeeSuccess, deleteEmployeeFail,
  resetPassword, resetPasswordSuccess, resetPasswordFail,
  fetchStats, fetchStatsSuccess, fetchStatsFail
} = employeeSlice.actions;

export default employeeSlice.reducer;
