export const roleBasedRedirects = {
    // Role names must match exactly the strings returned by getUser()?.role
    Cashier: '/pos/dashboard',
    PlatformAdmin: '/admin/dashboard',
    TenantAdmin: '/admin/dashboard'
};