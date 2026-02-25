const getStoreCurrency = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        return {
            symbol: user?.store?.currency?.symbol || 'BD',
            code: user?.store?.currency?.code || 'BHD'
        };
    } catch (e) {
        return { symbol: 'BD', code: 'BHD' };
    }
};

export const formatAmountwithoutsymbol = (value) => {
    const numericValue = typeof value === "string" ? Number(value) : value;

    if (isNaN(numericValue) || numericValue === null || numericValue === undefined) {
        return "0.000";
    }

    const { code } = getStoreCurrency();
    return numericValue.toLocaleString(code === 'INR' ? "en-IN" : "en-US", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
    });
};

export const formatAmountWithComma = (value) => {
    const numericValue = typeof value === "string" ? Number(value) : value;
    const { symbol, code } = getStoreCurrency();

    if (isNaN(numericValue) || numericValue === null || numericValue === undefined) {
        return `${symbol} 0.000`;
    }

    return `${symbol} ${numericValue.toLocaleString(code === 'INR' ? "en-IN" : "en-US", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
    })}`;
};

export const getCurrencySymbol = () => getStoreCurrency().symbol;
