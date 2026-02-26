import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { tokenManager } from 'utils/tokenManager';
import { getRoleBasedRedirect } from 'constants/roleBasedRedirects';

const ADMIN_ROLES = ['SUPER_ADMIN', 'STORE_ADMIN'];

const AuthGuard = ({ children, permittedRoles, module }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for access token using token manager
    const token = tokenManager.getAccessToken();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      tokenManager.clearTokens();
      navigate('/login');
      return;
    }

    // Role-based access control
    if (permittedRoles && permittedRoles.length > 0 && !permittedRoles.includes('all')) {
      if (!user || !permittedRoles.includes(user.role)) {
        const storeCode = user?.store?.code || 'store';
        const targetUrl = getRoleBasedRedirect(user?.role, storeCode);
        navigate(targetUrl);
        return;
      }
    }

    // Module-level can_view permission check (skip for admins)
    if (module && user && !ADMIN_ROLES.includes(user.role)) {
      try {
        const storedPerms = localStorage.getItem('permissions');
        if (storedPerms && storedPerms !== 'null') {
          const permsObj = JSON.parse(storedPerms);
          if (!permsObj?.[module]?.can_view) {
            const storeCode = user?.store?.code || 'store';
            navigate(getRoleBasedRedirect(user.role, storeCode));
          }
        }
      } catch {
        // Corrupt permissions — silently ignore, let the page load
      }
    }
  }, [navigate, permittedRoles, module]);

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.element.isRequired,
  permittedRoles: PropTypes.arrayOf(PropTypes.string),
  module: PropTypes.string,
};

export default AuthGuard;
