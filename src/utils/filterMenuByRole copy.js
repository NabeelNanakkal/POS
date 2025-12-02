const filterMenuByRole = (items, userRole) => {
    console.log("[38;5;208m 🎈🎈[ items ]========== [0m", items);
    if (!items) return [];
    return items
        .filter(item => {
            // Only handle permittedRoles
            if (item.permittedRoles !== undefined) {
                // If permittedRoles is empty array, deny access
                if (item.permittedRoles.length === 0) {
                    return false;
                }
                // If permittedRoles contains "all", grant access to everyone
                if (item.permittedRoles.includes('all')) {
                    return true;
                }
                // If permittedRoles has specific roles, check if user role is included
                return item.permittedRoles.includes(userRole);
            } else return false;

            // If no permittedRoles defined, allow access (backwards compatibility)

        })
        .map(item => {
            if (item.children) {
                const filteredChildren = filterRoutesByRole(item.children, userRole);
                // If a item has no element and no accessible children, remove it
                if (filteredChildren.length === 0 && !item.element) {
                    return null;
                }

                return { ...item, children: filteredChildren };
            }
            return item;
        })
        .filter(Boolean);
};




export default filterMenuByRole