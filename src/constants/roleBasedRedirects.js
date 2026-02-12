export const getRoleBasedRedirect = (role, storeCode = 'store') => {
  const redirects = {
    // Role names must match exactly the strings returned by getUser()?.role
    SUPER_ADMIN: '/super-admin/dashboard',
    STORE_ADMIN: `/pos/${storeCode}/dashboard`,
    MANAGER: `/pos/${storeCode}/dashboard`,
    CASHIER: `/pos/${storeCode}/dashboard`,
    INVENTORY_MANAGER: `/pos/${storeCode}/dashboard` 
  };
  
  return redirects[role] || `/pos/${storeCode}/dashboard`;
};

// Legacy export for backwards compatibility
export const roleBasedRedirects = {
  SUPER_ADMIN: '/super-admin/dashboard',
  STORE_ADMIN: '/pos/dashboard',
  MANAGER: '/pos/dashboard',
  CASHIER: '/pos/dashboard',
  INVENTORY_MANAGER: '/pos/dashboard' 
};
