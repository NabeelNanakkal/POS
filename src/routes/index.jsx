import { createBrowserRouter } from 'react-router-dom';

// routes
import LoginRoutes from './AuthenticationRoutes';
import PosRoutes from './PosRoutes';

// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter([LoginRoutes, PosRoutes], {
  basename: "/"
});

export default router;
