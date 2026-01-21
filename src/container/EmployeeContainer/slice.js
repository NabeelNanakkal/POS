import { createSlice } from '@reduxjs/toolkit';

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employees: [],
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
      state.employees = action.payload.data || [];
    },
    fetchEmployeesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setEmployeesBulk: (state, action) => {
      // Map extracted Excel data to our internal model
      const newEmployees = action.payload.map((item, index) => ({
        id: Date.now() + index,
        name: item.Name || item.name,
        email: item.Email || item.email,
        role: item.Role || item.role || 'Cashier',
        storeId: item.StoreID || item.StoreId || item.storeId,
        status: 'Online',
        active: true
      }));
      state.employees = newEmployees;
    },
    createEmployee: (state) => {
      state.loading = true;
      state.error = null;
    },
    createEmployeeSuccess: (state, action) => {
      state.loading = false;
      state.employees.push(action.payload.data);
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
      const index = state.employees.findIndex((e) => e.id === action.payload.data.id);
      if (index !== -1) {
        state.employees[index] = action.payload.data;
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
    }
  }
});

export const {
  fetchEmployees, fetchEmployeesSuccess, fetchEmployeesFail,
  setEmployeesBulk,
  createEmployee, createEmployeeSuccess, createEmployeeFail,
  updateEmployee, updateEmployeeSuccess, updateEmployeeFail,
  deleteEmployee, deleteEmployeeSuccess, deleteEmployeeFail
} = employeeSlice.actions;

export default employeeSlice.reducer;
