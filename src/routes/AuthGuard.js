import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children, permittedRoles }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token) {
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
