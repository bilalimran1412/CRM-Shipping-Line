import {PATH_DASHBOARD} from "../../../routes/paths"
import {ROUTE_URL, VIEW_PERMISSION} from "./config"
import {ICONS} from "../../../layouts/dashboard/nav/config-navigation"
import profileIcon from "./assets/profile.svg";
import SvgColor from "components/svg-color";

const navConfig = (checkPermission) => {
  // console.log(checkPermission('user.view_user'))
  return [
    {
      title: 'profile.title.navigation',
      path: `/${ROUTE_URL}`,
      icon: <SvgColor src={profileIcon} sx={{width: 1, height: 1}}/>,
      permission: checkPermission(VIEW_PERMISSION),
      exact: true,
    },
  ]
}

export default navConfig