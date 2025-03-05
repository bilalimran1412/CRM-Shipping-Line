import {navigation as userNav} from 'apps/user'
import {navigation as logisticNav} from 'apps/logistic'

const navigationConfig = (checkPermission) => {
  // const navigation = []
  //
  // apps.filter(app => !!app.navigation).forEach(app => {
  //   if (typeof app.navigation == 'function') {
  //     navigation.push(...app.navigation(checkPermission))
  //   } else {
  //     navigation.push(...app.navigation)
  //   }
  // })
  return [
    {
      subheader: 'menu.management',
      items: [
        ...logisticNav(checkPermission),
        ...userNav(checkPermission),
      ]
    },
  ]
}
export default navigationConfig