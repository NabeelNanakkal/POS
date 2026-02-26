import RolePermission, { MODULES, CONFIGURABLE_ROLES } from '../models/role-permission.model.js';

// ─── Default permission table ─────────────────────────────────────────────────
// Keys: module names. Values: array of allowed actions.
const DEFAULT_PERMISSIONS = {
  MANAGER: {
    dashboard:      { can_view: true,  can_create: true,  can_edit: true,  can_delete: true,  can_print: true,  can_export: true  },
    products:       { can_view: true,  can_create: true,  can_edit: true,  can_delete: true,  can_print: true,  can_export: true  },
    categories:     { can_view: true,  can_create: true,  can_edit: true,  can_delete: true,  can_print: false, can_export: true  },
    inventory:      { can_view: true,  can_create: true,  can_edit: true,  can_delete: true,  can_print: true,  can_export: true  },
    orders:         { can_view: true,  can_create: true,  can_edit: true,  can_delete: true,  can_print: true,  can_export: true  },
    customers:      { can_view: true,  can_create: true,  can_edit: true,  can_delete: true,  can_print: false, can_export: true  },
    employees:      { can_view: true,  can_create: false, can_edit: true,  can_delete: false, can_print: false, can_export: false },
    reports:        { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: true,  can_export: true  },
    discounts:      { can_view: true,  can_create: true,  can_edit: true,  can_delete: true,  can_print: false, can_export: false },
    cash_management:{ can_view: true,  can_create: true,  can_edit: true,  can_delete: false, can_print: true,  can_export: true  },
    payment_modes:  { can_view: true,  can_create: true,  can_edit: true,  can_delete: false, can_print: false, can_export: false },
    settings:       { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    integrations:   { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
  },
  CASHIER: {
    dashboard:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    products:       { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: true,  can_export: false },
    categories:     { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    inventory:      { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    orders:         { can_view: true,  can_create: true,  can_edit: false, can_delete: false, can_print: true,  can_export: false },
    customers:      { can_view: true,  can_create: true,  can_edit: false, can_delete: false, can_print: false, can_export: false },
    employees:      { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    reports:        { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    discounts:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    cash_management:{ can_view: true,  can_create: true,  can_edit: false, can_delete: false, can_print: false, can_export: false },
    payment_modes:  { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    settings:       { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    integrations:   { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
  },
  INVENTORY_MANAGER: {
    dashboard:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    products:       { can_view: true,  can_create: true,  can_edit: true,  can_delete: true,  can_print: true,  can_export: true  },
    categories:     { can_view: true,  can_create: true,  can_edit: true,  can_delete: false, can_print: false, can_export: false },
    inventory:      { can_view: true,  can_create: true,  can_edit: true,  can_delete: true,  can_print: true,  can_export: true  },
    orders:         { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    customers:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    employees:      { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    reports:        { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: true  },
    discounts:      { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    cash_management:{ can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    payment_modes:  { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    settings:       { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    integrations:   { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
  },
  ACCOUNTANT: {
    dashboard:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    products:       { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: true  },
    categories:     { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    inventory:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: true  },
    orders:         { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: true  },
    customers:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    employees:      { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    reports:        { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: true,  can_export: true  },
    discounts:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    cash_management:{ can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: true  },
    payment_modes:  { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    settings:       { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    integrations:   { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build the permissions array from DEFAULT_PERMISSIONS for a given role.
 */
export const buildDefaultPermissionsArray = (role) => {
  const roleDefaults = DEFAULT_PERMISSIONS[role] || {};
  return MODULES.map((module) => ({
    module,
    can_view:   roleDefaults[module]?.can_view   ?? false,
    can_create: roleDefaults[module]?.can_create ?? false,
    can_edit:   roleDefaults[module]?.can_edit   ?? false,
    can_delete: roleDefaults[module]?.can_delete ?? false,
    can_print:  roleDefaults[module]?.can_print  ?? false,
    can_export: roleDefaults[module]?.can_export ?? false,
  }));
};

/**
 * Convert permissions array → flat object keyed by module.
 * e.g. { dashboard: { can_view: true, ... }, products: { ... } }
 */
export const permissionsArrayToObject = (arr = []) => {
  return arr.reduce((acc, entry) => {
    acc[entry.module] = {
      can_view:   entry.can_view,
      can_create: entry.can_create,
      can_edit:   entry.can_edit,
      can_delete: entry.can_delete,
      can_print:  entry.can_print,
      can_export: entry.can_export,
    };
    return acc;
  }, {});
};

// ─── CRUD ─────────────────────────────────────────────────────────────────────

/**
 * Get existing permissions or create with defaults.
 */
export const getOrCreatePermissions = async (storeId, role) => {
  let doc = await RolePermission.findOne({ store: storeId, role });
  if (!doc) {
    doc = await RolePermission.create({
      store:       storeId,
      role,
      permissions: buildDefaultPermissionsArray(role),
    });
  }
  return doc;
};

/**
 * Upsert permissions for a role in a store.
 */
export const updatePermissions = async (storeId, role, permissionsArray, userId) => {
  return RolePermission.findOneAndUpdate(
    { store: storeId, role },
    { permissions: permissionsArray, updatedBy: userId },
    { new: true, upsert: true, runValidators: true }
  );
};

// ─── Login helper ─────────────────────────────────────────────────────────────

/**
 * Returns null for SUPER_ADMIN / STORE_ADMIN (full bypass),
 * or a flat permissions object for configurable roles.
 */
export const resolveLoginPermissions = async (user) => {
  if (['SUPER_ADMIN', 'STORE_ADMIN'].includes(user.role)) return null;
  if (!user.store) return null;

  const storeId = user.store?._id || user.store;
  const doc = await getOrCreatePermissions(storeId, user.role);
  return permissionsArrayToObject(doc.permissions);
};
