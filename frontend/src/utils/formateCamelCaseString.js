export function formatCamelCaseToTitle(str) {
    // Split the string at uppercase letters and join with spaces
    const formatted = str
        .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
        .trim() // Remove any leading/trailing spaces
        .toLowerCase() // Convert to lowercase first
        .replace(/(^|\s)\w/g, letter => letter.toUpperCase()); // Capitalize first letter of each word

    return formatted;
}