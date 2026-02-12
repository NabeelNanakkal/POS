import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { tokenManager } from 'utils/tokenManager';

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
        // Redirect based on user role
        if (user?.role === 'SUPER_ADMIN') {
          // Super admins should go to super admin dashboard
          navigate('/super-admin/dashboard');
        } else if (user?.role === 'STORE_ADMIN') {
          // Store admins should go to admin dashboard
          navigate('/admin/dashboard');
        } else {
          // Other users go to POS dashboard
          const storeCode = user?.store?.code || 'store';
          navigate(`/pos/${storeCode}/dashboard`);
        }
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
