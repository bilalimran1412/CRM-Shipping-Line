import SvgColor from "../../components/svg-color";
import vehicle from "./vehicle"
import destination from "./destination"
import deliveryStatus from "./delivery-status"
import vehiclePhotoCategory from "./vehicle-photo-category"
import invoice from "./invoice"
import task from "./vehicletask"
import customerInvoice from "./pricing"
import mytask from "./mytask"
import {VIEW_PERMISSION} from "./delivery-status/config";


const apps = [
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
    {
      ignoreSearchbar: true,
      title: 'navigation.logistic',
      path: `/logistic`,
      permission: checkPermission(perm => perm.includes('logistic')),
      children: [
        ...vehicle.navigation(checkPermission),
        ...destination.navigation(checkPermission),
        ...deliveryStatus.navigation(checkPermission),
        ...vehiclePhotoCategory.navigation(checkPermission),
        ...invoice.navigation(checkPermission),
        ...task.navigation(checkPermission),
        ...mytask.navigation(checkPermission),
        ...customerInvoice.navigation(checkPermission),
      ],
    },
  ]
}
export default apps