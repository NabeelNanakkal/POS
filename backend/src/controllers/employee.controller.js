import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as employeeService from '../services/employee.service.js';

export const getEmployees = asyncHandler(async (req, res) => {
  const data = await employeeService.getEmployees(req.query, { ...req.user.toObject(), storeId: req.storeId });
  res.json(ApiResponse.success(data));
});

export const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id);
  res.json(ApiResponse.success(employee));
});

export const createEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.createEmployee(req.body);
  res.status(201).json(ApiResponse.created(employee, 'Employee created successfully'));
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.updateEmployee(req.params.id, req.body);
  res.json(ApiResponse.success(employee, 'Employee updated successfully'));
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  await employeeService.deleteEmployee(req.params.id);
  res.json(ApiResponse.success(null, 'Employee deleted successfully'));
});

export const bulkCreateEmployees = asyncHandler(async (req, res) => {
  const employees = await employeeService.bulkCreateEmployees(req.body.employees);
  res.status(201).json(ApiResponse.created(employees, `${employees.length} employees imported successfully`));
});

export const resetEmployeePassword = asyncHandler(async (req, res) => {
  await employeeService.resetEmployeePassword(req.params.id, req.body.password);
  res.json(ApiResponse.success(null, 'Password reset successfully'));
});
