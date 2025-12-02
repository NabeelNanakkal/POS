export const roleBasedRedirects = {
    // Role names must match exactly the strings returned by getUser()?.role
    Telecaller: '/main/user',
    PlatformAdmin: '/main/admin',
    TenantAdmin: '/main/admin'
};