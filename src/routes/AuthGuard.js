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

    if (permittedRoles && permittedRoles.length > 0 && !permittedRoles.includes('all')) {
      if (!user || !permittedRoles.includes(user.role)) {
        // Redirection logic if unauthorized
        navigate('/pos/dashboard');
      }
    }
  }, [navigate, permittedRoles]);

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.element.isRequired
};

export default AuthGuard;
