export const MODULES = [
  { key: 'dashboard',       label: 'Dashboard' },
  { key: 'products',        label: 'Products' },
  { key: 'categories',      label: 'Categories' },
  { key: 'inventory',       label: 'Inventory' },
  { key: 'orders',          label: 'Orders' },
  { key: 'customers',       label: 'Customers' },
  { key: 'employees',       label: 'Employees' },
  { key: 'reports',         label: 'Reports' },
  { key: 'discounts',       label: 'Discounts' },
  { key: 'cash_management', label: 'Cash Management' },
  { key: 'payment_modes',   label: 'Payment Modes' },
  { key: 'settings',        label: 'Settings' },
  { key: 'integrations',    label: 'Integrations' },
];

export const ACTIONS = ['view', 'create', 'edit', 'delete', 'print', 'export'];

export const CONFIGURABLE_ROLES = ['MANAGER', 'CASHIER', 'INVENTORY_MANAGER', 'ACCOUNTANT'];

/**
 * Defines which actions are actually meaningful per module.
 * Cells not listed here will show as "—" (not applicable) in the UI.
 */
export const MODULE_ACTIONS = {
  dashboard:       ['view'],
  products:        ['view', 'create', 'edit', 'delete', 'print', 'export'],
  categories:      ['view', 'create', 'edit', 'delete'],
  inventory:       ['view', 'create', 'edit', 'delete', 'print', 'export'],
  orders:          ['view', 'create', 'edit', 'delete', 'print', 'export'],
  customers:       ['view', 'create', 'edit', 'delete', 'export'],
  employees:       ['view', 'edit'],
  reports:         ['view', 'print', 'export'],
  discounts:       ['view', 'create', 'edit', 'delete'],
  cash_management: ['view', 'create', 'print', 'export'],
  payment_modes:   ['view', 'create', 'edit'],
  settings:        ['view', 'edit'],
  integrations:    ['view', 'edit'],
};

const ALL = { can_view: true, can_create: true,  can_edit: true,  can_delete: true,  can_print: true,  can_export: true };
const NONE = { can_view: false, can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false };

export const DEFAULT_PERMISSIONS = {
  MANAGER: {
    dashboard:      ALL,
    products:       ALL,
    categories:     { can_view: true,  can_create: true,  can_edit: true,  can_delete: true,  can_print: false, can_export: true  },
    inventory:      ALL,
    orders:         ALL,
    customers:      { can_view: true,  can_create: true,  can_edit: true,  can_delete: true,  can_print: false, can_export: true  },
    employees:      { can_view: true,  can_create: false, can_edit: true,  can_delete: false, can_print: false, can_export: false },
    reports:        { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: true,  can_export: true  },
    discounts:      { can_view: true,  can_create: true,  can_edit: true,  can_delete: true,  can_print: false, can_export: false },
    cash_management:{ can_view: true,  can_create: true,  can_edit: true,  can_delete: false, can_print: true,  can_export: true  },
    payment_modes:  { can_view: true,  can_create: true,  can_edit: true,  can_delete: false, can_print: false, can_export: false },
    settings:       { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    integrations:   NONE,
  },
  CASHIER: {
    dashboard:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    products:       { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: true,  can_export: false },
    categories:     { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    inventory:      NONE,
    orders:         { can_view: true,  can_create: true,  can_edit: false, can_delete: false, can_print: true,  can_export: false },
    customers:      { can_view: true,  can_create: true,  can_edit: false, can_delete: false, can_print: false, can_export: false },
    employees:      NONE,
    reports:        NONE,
    discounts:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    cash_management:{ can_view: true,  can_create: true,  can_edit: false, can_delete: false, can_print: false, can_export: false },
    payment_modes:  { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    settings:       NONE,
    integrations:   NONE,
  },
  INVENTORY_MANAGER: {
    dashboard:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    products:       ALL,
    categories:     { can_view: true,  can_create: true,  can_edit: true,  can_delete: false, can_print: false, can_export: false },
    inventory:      ALL,
    orders:         { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    customers:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    employees:      NONE,
    reports:        { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: true  },
    discounts:      NONE,
    cash_management:NONE,
    payment_modes:  NONE,
    settings:       NONE,
    integrations:   NONE,
  },
  ACCOUNTANT: {
    dashboard:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    products:       { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: true  },
    categories:     { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    inventory:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: true  },
    orders:         { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: true  },
    customers:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    employees:      NONE,
    reports:        { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: true,  can_export: true  },
    discounts:      { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    cash_management:{ can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: true  },
    payment_modes:  { can_view: true,  can_create: false, can_edit: false, can_delete: false, can_print: false, can_export: false },
    settings:       NONE,
    integrations:   NONE,
  },
};
