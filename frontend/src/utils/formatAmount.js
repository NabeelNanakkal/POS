const getStoreCurrency = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        return {
            symbol: user?.store?.currency?.symbol || '₹',
            code: user?.store?.currency?.code || 'INR'
        };
    } catch (e) {
        return { symbol: '₹', code: 'INR' };
    }
};

export const formatAmountwithoutsymbol = (value) => {
    const numericValue = typeof value === "string" ? Number(value) : value;

    if (isNaN(numericValue) || numericValue === null || numericValue === undefined) {
        return "0.00";
    }

    const { code } = getStoreCurrency();
    return numericValue.toLocaleString(code === 'INR' ? "en-IN" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export const formatAmountWithComma = (value) => {
    const numericValue = typeof value === "string" ? Number(value) : value;
    const { symbol, code } = getStoreCurrency();

    if (isNaN(numericValue) || numericValue === null || numericValue === undefined) {
        return `${symbol} 0.00`;
    }

    return `${symbol} ${numericValue.toLocaleString(code === 'INR' ? "en-IN" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

export const getCurrencySymbol = () => getStoreCurrency().symbol;

