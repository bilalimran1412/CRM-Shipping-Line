// routes
import {PATH_DASHBOARD} from '../../../routes/paths'
// components
import SvgColor from '../../../components/svg-color'
import navigationConfig from "../../../configs/navigationConfig"

// ----------------------------------------------------------------------

export const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{width: 1, height: 1}}/>
)

export const ICONS = {
  user: icon('ic_user'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
}

const navConfig = (checkPermission) => {
  return [
    ...navigationConfig(checkPermission),
  ]
}

export default navConfig
