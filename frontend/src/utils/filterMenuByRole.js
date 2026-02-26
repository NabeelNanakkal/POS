const ADMIN_ROLES = ['SUPER_ADMIN', 'STORE_ADMIN'];

/**
 * @param {Array}  items       - Menu items array
 * @param {string} userRole    - Current user's role
 * @param {object|null} permissions - Flat permissions map from Redux/localStorage.
 *                                    null = full bypass (admin). object = filter by can_view.
 */
export const filterMenuByRole = (items, userRole, permissions = null) => {
    // Top level debug log
    console.log('[filterMenuByRole] CALLED', {
        itemCount: items?.length,
        userRole,
        timestamp: new Date().toISOString()
    });

    if (!items) return [];

    const isAdmin = ADMIN_ROLES.includes(userRole);

    return items
        .filter(item => {
            const prs = item.permittedRoles;
            if (prs === undefined) return false;

            // Exclusions are specified with a leading '!' or 'not:' prefix
            const exclusions = prs
                .filter(p => typeof p === 'string' && (p.startsWith('!') || p.startsWith('not:')))
                .map(p => (p.startsWith('!') ? p.slice(1) : p.startsWith('not:') ? p.slice(4) : p));

            const inclusions = prs.filter(p => !(typeof p === 'string' && (p.startsWith('!') || p.startsWith('not:'))));

            let roleAllowed;
            // If inclusions include 'all' => allow everyone except exclusions
            if (inclusions.includes('all')) {
                roleAllowed = !exclusions.includes(userRole);
            // If explicit inclusions provided => user must be in inclusions and not excluded
            } else if (inclusions.length > 0) {
                roleAllowed = inclusions.includes(userRole) && !exclusions.includes(userRole);
            // Only exclusions provided => allow all except exclusions
            } else {
                roleAllowed = !exclusions.includes(userRole);
            }

            if (!roleAllowed) return false;

            // Module-level permission check (skip for admins and items without a module key)
            if (item.module && !isAdmin && permissions !== null) {
                if (!permissions[item.module]?.can_view) return false;
            }

            return true;
        })
        .map(item => {
            if (item.children) {
                const filteredChildren = filterMenuByRole(item.children, userRole, permissions);

                if (item.id === 'master-data') {
                    console.log('[filterMenuByRole] DEBUG Master Data:', {
                        original: item.children.length,
                        filtered: filteredChildren.length,
                        type: item.type,
                        filteredChildren
                    });
                }

                if (filteredChildren.length === 0 && !item.element) {
                    return null;
                }

                // Explicitly preserving all properties including 'type'
                return { ...item, children: filteredChildren };
            }
            return item;
        })
        .filter(Boolean);
};
