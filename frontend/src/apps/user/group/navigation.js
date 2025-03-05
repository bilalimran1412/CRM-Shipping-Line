import {PATH_DASHBOARD} from "../../../routes/paths"
import {ROUTE_URL, VIEW_PERMISSION} from "./config"

const navConfig = (checkPermission) => {
  return [
    {
      title: 'group.title.navigation',
      path: `/${ROUTE_URL}`,
      permission: checkPermission(VIEW_PERMISSION)
    },
  ]
}

export default navConfig