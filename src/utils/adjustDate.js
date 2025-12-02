export function adjustDate(dateStr, operator = "+", days = 1) {
    const date = new Date(dateStr);

    if (isNaN(date)) {
        throw new Error("Invalid date format. Use 'YYYY-MM-DD'.");
    }

    if (operator === '+') {
        date.setDate(date.getDate() + days);
    } else if (operator === '-') {
        date.setDate(date.getDate() - days);
    } else {
        throw new Error("Operator must be '+' or '-'.");
    }

    // Format back to YYYY-MM-DD
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
}
