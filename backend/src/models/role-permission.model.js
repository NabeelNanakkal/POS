import mongoose from 'mongoose';

export const MODULES = [
  'dashboard',
  'products',
  'categories',
  'inventory',
  'orders',
  'customers',
  'employees',
  'reports',
  'discounts',
  'cash_management',
  'payment_modes',
  'settings',
  'integrations',
];

export const CONFIGURABLE_ROLES = ['MANAGER', 'CASHIER', 'INVENTORY_MANAGER', 'ACCOUNTANT'];

const permissionEntrySchema = new mongoose.Schema(
  {
    module:     { type: String, required: true },
    can_view:   { type: Boolean, default: false },
    can_create: { type: Boolean, default: false },
    can_edit:   { type: Boolean, default: false },
    can_delete: { type: Boolean, default: false },
    can_print:  { type: Boolean, default: false },
    can_export: { type: Boolean, default: false },
  },
  { _id: false }
);

const rolePermissionSchema = new mongoose.Schema(
  {
    store:       { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    role:        { type: String, enum: CONFIGURABLE_ROLES, required: true },
    permissions: [permissionEntrySchema],
    updatedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

rolePermissionSchema.index({ store: 1, role: 1 }, { unique: true });

const RolePermission = mongoose.model('RolePermission', rolePermissionSchema);

export default RolePermission;
