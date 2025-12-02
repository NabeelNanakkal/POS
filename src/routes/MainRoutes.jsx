import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import MenuRoutes from './MenuRoutes';
import AuthGuard from './AuthGuard';
const InitialRouteChecker = Loadable(lazy(() => import('./RouteChecker')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <>
      {/* <AuthGuard> */}
        <MainLayout />
      {/* </AuthGuard> */}
    </>
  ),
  children: [{ path: '', element: <InitialRouteChecker /> }, MenuRoutes]
};


export default MainRoutes;
