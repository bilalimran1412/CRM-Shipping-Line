import {PATH_DASHBOARD} from "../../../routes/paths"
import {ROUTE_URL, VIEW_PERMISSION} from "./config"
import {ICONS} from "../../../layouts/dashboard/nav/config-navigation"

const navConfig = (checkPermission) => {
  // console.log(checkPermission('user.view_user'))
  return [
    {
      title: 'user.title.navigation',
      path: `/${ROUTE_URL}`,
      permission: checkPermission(VIEW_PERMISSION),
      exact: true,
    },
  ]
}

export default navConfig