import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let isAuthenticated = localStorage.getItem(import.meta.env.VITE_APP_SESSION_TOKEN);
    try {
    } catch (error) {
    }
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [dispatch, navigate]);

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.element.isRequired
};

export default AuthGuard;
