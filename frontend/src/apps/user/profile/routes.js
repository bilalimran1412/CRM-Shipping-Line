import {Loadable} from "routes/elements"
import {checkPermissionRender} from "../../../auth/utils"
import {lazy} from "react"
import {ROUTE_URL, VIEW_PERMISSION} from "./config"

export const Profile = Loadable(lazy(() => import('./views')))
const routes = (checkPermission) => {
  return [
    {
      path: ROUTE_URL,
      children: [
        {path: '', element: checkPermissionRender(checkPermission(VIEW_PERMISSION), <Profile/>)},
      ],
    },
  ]
}
export default routes