export const roleBasedRedirects = {
    // Role names must match exactly the strings returned by getUser()?.role
    SUPER_ADMIN: '/admin/dashboard',
    ADMIN: '/admin/dashboard',
    MANAGER: '/pos/dashboard',
    CASHIER: '/pos/dashboard',
    INVENTORY_MANAGER: '/pos/dashboard' 
};