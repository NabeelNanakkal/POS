// export const formatAmountWithComma = (value) => {
//     const numericValue = typeof value === "string" ? Number(value) : value;

//     if (isNaN(numericValue) || numericValue === null || numericValue === undefined) {
//         return "-"; 
//     }

//     return `₹ ${numericValue.toLocaleString("en-IN", { 
//         minimumFractionDigits: 2, 
//         maximumFractionDigits: 2 
//     })}`;
// };
export const formatAmountwithoutsymbol = (value) => {
    const numericValue = typeof value === "string" ? Number(value) : value;

    if (isNaN(numericValue) || numericValue === null || numericValue === undefined) {
        return "-";
    }

    return `${numericValue.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};



export const formatAmountWithComma = (value) => {

    const numericValue = typeof value === "string" ? Number(value) : value;

    if (isNaN(numericValue) || numericValue === null || numericValue === undefined) {
        return "-";
    }

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};