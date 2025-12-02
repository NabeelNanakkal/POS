
export const isRolePermitted = (permittedRoles, role) => {
  if (!Array.isArray(permittedRoles) || !role) return true;
  if (permittedRoles.includes("all")) return true;
  return permittedRoles.includes(role);
};