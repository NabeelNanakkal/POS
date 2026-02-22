


export const getFieldSize = (size) => {
    const sizeMapping = {
        xxxs: 1,
        xxs: 2,
        xxsm: 2.5,
        xs: 3,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 10,
        xxl: 12,
    };
    return sizeMapping[size] || 6;
}; 