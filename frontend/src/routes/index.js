import {Navigate, useRoutes} from 'react-router-dom'
// auth
import AuthGuard from '../auth/AuthGuard'
import GuestGuard from '../auth/GuestGuard'
// layouts
import CompactLayout from '../layouts/compact'
import DashboardLayout from '../layouts/dashboard'
// config
import {PATH_AFTER_LOGIN} from '../config-global'
//
import {
  Page404,
} from './elements'
import routeConfig from "../configs/routeConfig"
import authRoutes from "apps/core/auth/routes"
import {useAuthContext} from "../auth/useAuthContext"
// ----------------------------------------------------------------------

export default function Router() {
  const {checkPermission} = useAuthContext()
  return useRoutes([
    ...authRoutes,
    {element: <Navigate to={PATH_AFTER_LOGIN} replace/>, index: true},
    {
      path: '/*',
      element: (
        <AuthGuard>
          <DashboardLayout/>
        </AuthGuard>
      ),
      children: [
        ...routeConfig(checkPermission),
        {
          element: <CompactLayout fullHeight={false}/>,
          children: [{path: '*', element: <Page404/>}],
        },
        // {path: '*', element: <Navigate to="/404" replace/>},
      ]
    },
  ])
}
