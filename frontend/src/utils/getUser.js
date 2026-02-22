export const getUser = () => {
    try {
        const user = localStorage.getItem("user");
        const parsed = user ? JSON.parse(user) : null;
        // lightweight debug to help diagnose refresh issues
        if (import.meta.env.DEV) console.debug('[getUser] parsed user from localStorage:', parsed);
        return parsed;
    } catch (err) {
        console.error('[getUser] failed to parse user from localStorage', err);
        return null;
    }
}