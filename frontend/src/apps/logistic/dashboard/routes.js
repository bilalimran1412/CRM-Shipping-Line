import {Navigate} from "react-router-dom"
import {PATH_AFTER_LOGIN} from "config-global"
import {Loadable, LoginPage, PageFive, PageFour, PageOne, PageSix, PageThree, PageTwo} from "routes/elements"
import AuthGuard from "auth/AuthGuard"
import DashboardLayout from "layouts/dashboard"
import {checkPermissionRender} from "../../../auth/utils"
import {lazy} from "react"
import {CREATE_PERMISSION, ROUTE_URL, UPDATE_PERMISSION, VIEW_PERMISSION} from "./config"
export const View = Loadable(lazy(() => import('./views/View')))
const routes = (checkPermission) => {
  return [
    {
      path: ROUTE_URL,
      children: [
        // {element: <Navigate to={'list'} replace/>, index: true},
        {path: '', element: checkPermissionRender(checkPermission(VIEW_PERMISSION), <View/>)},
      ],
    },
  ]
}
export default routes
