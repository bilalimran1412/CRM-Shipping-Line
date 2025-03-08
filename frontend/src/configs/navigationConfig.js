import {navigation as userNav} from 'apps/user'
import {navigation as logisticNav} from 'apps/logistic'
import {navigation as shipmentNav} from 'apps/shipment'
import {navigation as financeNav} from 'apps/finance'

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
        ...shipmentNav(checkPermission),
        ...financeNav(checkPermission),
        ...userNav(checkPermission),
]
    },
  ]
}
export default navigationConfig