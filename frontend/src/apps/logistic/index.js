import SvgColor from "../../components/svg-color";
import vehicle from "./vehicle"
import destination from "./destination"
import deliveryStatus from "./delivery-status"
import vehiclePhotoCategory from "./vehicle-photo-category"
import invoice from "./invoice"
import task from "./vehicle-task"
import customerInvoice from "./pricing"
import mytask from "./mytask"
import {VIEW_PERMISSION} from "./delivery-status/config";
import dashboard from "./dashboard"


const apps = [
  dashboard,
  vehicle,
  destination,
  deliveryStatus,
  vehiclePhotoCategory,
  invoice,
  task,
  mytask,
  customerInvoice
]

export const navigation = (checkPermission) => {
  return [
    ...dashboard.navigation(checkPermission),
    {
      ignoreSearchbar: true,
      title: 'navigation.logistic',
      path: `/logistic`,
      permission: checkPermission(perm => perm.includes('logistic')),
      children: [
        ...(vehicle.navigation(checkPermission)[0]?.permission ? vehicle.navigation(checkPermission) : []),
        ...(destination.navigation(checkPermission)[0]?.permission ? destination.navigation(checkPermission) : []),
        ...(deliveryStatus.navigation(checkPermission)[0]?.permission ? deliveryStatus.navigation(checkPermission) : []),
        ...(vehiclePhotoCategory.navigation(checkPermission)[0]?.permission ? vehiclePhotoCategory.navigation(checkPermission) : []),
        ...(invoice.navigation(checkPermission)[0]?.permission ? invoice.navigation(checkPermission) : []),
        ...(task.navigation(checkPermission)[0]?.permission ? task.navigation(checkPermission) : []),
        ...(mytask.navigation(checkPermission)[0]?.permission ? mytask.navigation(checkPermission) : []),
        ...(customerInvoice.navigation(checkPermission)[0]?.permission ? customerInvoice.navigation(checkPermission) : []),
      ],
    },
  ]
}
export default apps