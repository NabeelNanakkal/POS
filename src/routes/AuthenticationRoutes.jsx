import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import ErrorFallback from 'ui-component/ErrorFallback';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/authenticationMain/authentication3/LoginRetailOS')));
const AuthRegister3 = Loadable(lazy(() => import('views/authenticationMain/authentication3/Register3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  errorElement: <ErrorFallback />,
  children: [
    {
      path: '/login',
      element: <AuthLogin3 />
    },
    {
      path: '/signup',
      element: <AuthRegister3 />
    }
  ]
};

export default AuthenticationRoutes;
