// Utility to generate store-specific URLs
export const getStoreUrl = (path) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const storeCode = user?.store?.code || 'store';
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // If path starts with 'pos/', replace it with 'pos/{storeCode}/'
  if (cleanPath.startsWith('pos/')) {
    return `/${cleanPath.replace('pos/', `pos/${storeCode}/`)}`;
  }
  
  return `/${cleanPath}`;
};

// Get store code from localStorage
export const getStoreCode = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.store?.code || 'store';
};
