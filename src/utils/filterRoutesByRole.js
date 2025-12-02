export const filterRoutesByRole = (routes, userRole) => {

    if (!routes) return [];

    return routes
        .filter(route => {
            const prs = route.permittedRoles;
            if (prs === undefined) return false;
            if (!Array.isArray(prs) || prs.length === 0) return false;

            // Separately track exclusions (prefix '!' or 'not:') and inclusions
            const exclusions = prs
                .filter(p => typeof p === 'string' && (p.startsWith('!') || p.startsWith('not:')))
                .map(p => (p.startsWith('!') ? p.slice(1) : p.startsWith('not:') ? p.slice(4) : p));

            const inclusions = prs.filter(p => !(typeof p === 'string' && (p.startsWith('!') || p.startsWith('not:'))));

            // If inclusions explicitly list 'all' -> allow everyone except exclusions
            if (inclusions.includes('all')) {
                return !exclusions.includes(userRole);
            }

            // If there are explicit inclusions (like ['Admin','Manager']) -> user must be included and not excluded
            if (inclusions.length > 0) {
                return inclusions.includes(userRole) && !exclusions.includes(userRole);
            }

            // No explicit inclusions, only exclusions -> allow all except exclusions
            return !exclusions.includes(userRole);
        })
        .map(route => {
            if (route.children) {
                const filteredChildren = filterRoutesByRole(route.children, userRole);
                if (filteredChildren.length === 0 && !route.element) {
                    return null;
                }

                return { ...route, children: filteredChildren };
            }
            return route;
        })
        .filter(Boolean);
};