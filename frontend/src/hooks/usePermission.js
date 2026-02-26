import { useSelector } from 'react-redux';
import { selectPermissions } from 'container/permission/slice';

const ADMIN_ROLES = ['SUPER_ADMIN', 'STORE_ADMIN'];

const FULL_ACCESS = {
  canView: true, canCreate: true, canEdit: true,
  canDelete: true, canPrint: true, canExport: true,
};

const NO_ACCESS = {
  canView: false, canCreate: false, canEdit: false,
  canDelete: false, canPrint: false, canExport: false,
};

/**
 * Returns the permission flags for a given module for the currently logged-in user.
 * Admin roles (SUPER_ADMIN, STORE_ADMIN) always receive FULL_ACCESS.
 * @param {string} moduleName - One of the 13 module keys (e.g. 'products', 'orders')
 */
const usePermission = (moduleName) => {
  const permissions = useSelector(selectPermissions);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Admins bypass all permission checks
  if (permissions === null || ADMIN_ROLES.includes(user?.role)) {
    return FULL_ACCESS;
  }

  const m = permissions[moduleName];
  if (!m) return NO_ACCESS;

  return {
    canView:   Boolean(m.can_view),
    canCreate: Boolean(m.can_create),
    canEdit:   Boolean(m.can_edit),
    canDelete: Boolean(m.can_delete),
    canPrint:  Boolean(m.can_print),
    canExport: Boolean(m.can_export),
  };
};

export default usePermission;
