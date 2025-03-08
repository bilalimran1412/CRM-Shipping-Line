import {ROUTE_URL, VIEW_PERMISSION} from "./config"
import SvgColor from "../../../components/svg-color";

const navConfig = (checkPermission) => {
  return [
    {
      title: 'logistic-dashboard.title.navigation',
      path: `/${ROUTE_URL}`,
      permission: checkPermission(VIEW_PERMISSION),
      exact: true,
      // icon: <SvgColor src={dashboardIcon} sx={{width: 1, height: 1}}/>,
    },
  ]
}

export default navConfig