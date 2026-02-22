export const getShortForm = (text) => {
    if (!text) return "";

    return text
        .split(" ")                // split into words
        .filter(word => word)      // remove extra spaces
        .map(word => word[0].toUpperCase()) // take first letter, uppercase
        .join("");                 // join together
}