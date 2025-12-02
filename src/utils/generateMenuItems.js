
export const generateMenuItems = (basePath, configs) => {

    return Object.keys(configs).map((key) => {
        const config = configs[key].routerConfigs;
        const menuIcon = config?.icon
        const menuTitle = config?.title
        const menuPath = config?.path
        const permittedRoles = configs[key].permittedRoles
        return {
            id: key,
            title: menuTitle,
            type: 'item',
            url: `/${basePath}/${menuPath}`,
            icon: menuIcon,
            permittedRoles: permittedRoles,
        };
    });
};