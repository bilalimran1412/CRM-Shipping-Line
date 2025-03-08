import {Navigate} from "react-router-dom"
import {PATH_AFTER_LOGIN} from "config-global"
import {Loadable, LoginPage, PageFive, PageFour, PageOne, PageSix, PageThree, PageTwo} from "routes/elements"
import AuthGuard from "auth/AuthGuard"
import DashboardLayout from "layouts/dashboard"
import {checkPermissionRender} from "../../../auth/utils"
import {lazy} from "react"
import {CREATE_PERMISSION, ROUTE_URL, UPDATE_PERMISSION, VIEW_PERMISSION} from "./config"

export const List = Loadable(lazy(() => import('./views/List')))
export const Edit = Loadable(lazy(() => import('./views/Edit')))
export const Create = Loadable(lazy(() => import('./views/Create')))
export const View = Loadable(lazy(() => import('./views/View')))
const routes = (checkPermission) => {
  return [
    {
      path: ROUTE_URL,
      children: [
        // {element: <Navigate to={'list'} replace/>, index: true},
        {path: '', element: checkPermissionRender(checkPermission(VIEW_PERMISSION), <List/>)},
        // {path: 'edit/:id', element: checkPermissionRender(checkPermission(UPDATE_PERMISSION), <Edit/>)},
        // {path: 'view/:id', element: checkPermissionRender(checkPermission(VIEW_PERMISSION), <View/>)},
        // {path: 'create', element: checkPermissionRender(checkPermission(CREATE_PERMISSION), <Create/>)},
      ],
    },
  ]
}
export default routes
