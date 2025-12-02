export const getTransparentColor = (hexColor) => {
    if (!hexColor.startsWith("#")) return hexColor; // Ensure it's a valid hex

    // Convert hex to RGB
    const bigint = parseInt(hexColor.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // Check if it's red-dominant (adjust if needed)
    if (r > 200 && g < 100 && b < 100) {
        return `rgba(${r}, ${g}, ${b}, 0.5)`; // 50% opacity
    }

    return hexColor; // Return original if not red
};
