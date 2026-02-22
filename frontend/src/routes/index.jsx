import { createBrowserRouter } from 'react-router-dom';

// routes
import LoginRoutes from './AuthenticationRoutes';
import PosRoutes from './PosRoutes';

// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter([PosRoutes, LoginRoutes], {
  basename: "/"
});

export default router;
