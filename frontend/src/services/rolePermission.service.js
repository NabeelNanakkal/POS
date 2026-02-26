import api from './api';

const rolePermissionService = {
  getMyPermissions: () =>
    api.get('/role-permissions/my-permissions'),

  getByRole: (role) =>
    api.get(`/role-permissions/${role}`),

  updateByRole: (role, permissions) =>
    api.put(`/role-permissions/${role}`, { permissions }),
};

export default rolePermissionService;
