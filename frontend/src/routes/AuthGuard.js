import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { tokenManager } from 'utils/tokenManager';
import { getRoleBasedRedirect } from 'constants/roleBasedRedirects';

const AuthGuard = ({ children, permittedRoles }) => {
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
        // Redirect based on user role using our central constants
        const storeCode = user?.store?.code || 'store';
        const targetUrl = getRoleBasedRedirect(user?.role, storeCode);
        navigate(targetUrl);
      }
    }
  }, [navigate, permittedRoles]);

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.element.isRequired,
  permittedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default AuthGuard;
