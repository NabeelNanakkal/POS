export const filterMenuByRole = (items, userRole) => {

    if (!items) return [];

    return items
        .filter(item => {
            const prs = item.permittedRoles;
            if (prs === undefined) return false;
            if (!Array.isArray(prs) || prs.length === 0) return false;

            // Exclusions are specified with a leading '!' or 'not:' prefix
            const exclusions = prs
                .filter(p => typeof p === 'string' && (p.startsWith('!') || p.startsWith('not:')))
                .map(p => (p.startsWith('!') ? p.slice(1) : p.startsWith('not:') ? p.slice(4) : p));

            const inclusions = prs.filter(p => !(typeof p === 'string' && (p.startsWith('!') || p.startsWith('not:'))));

            // If inclusions include 'all' => allow everyone except exclusions
            if (inclusions.includes('all')) {
                return !exclusions.includes(userRole);
            }

            // If explicit inclusions provided => user must be in inclusions and not excluded
            if (inclusions.length > 0) {
                return inclusions.includes(userRole) && !exclusions.includes(userRole);
            }

            // Only exclusions provided => allow all except exclusions
            return !exclusions.includes(userRole);
        })
        .map(item => {
            if (item.children) {
                const filteredChildren = filterMenuByRole(item.children, userRole);
                if (filteredChildren.length === 0 && !item.element) {
                    return null;
                }

                return { ...item, children: filteredChildren };
            }
            return item;
        })
        .filter(Boolean);
};