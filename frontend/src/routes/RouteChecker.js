import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InitialRouteChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(import.meta.env.VITE_APP_SESSION_TOKEN);
    if (token) {
      navigate('/pos/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return null;
};

export default InitialRouteChecker;
