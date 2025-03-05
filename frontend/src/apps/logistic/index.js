import SvgColor from "../../components/svg-color";
import vehicle from "./vehicle"
import destination from "./destination"
import deliveryStatus from "./delivery-status"
import shipmentType from "./shipment-type"
import shipmentCompany from "./shipment-company"
import vehiclePhotoCategory from "./vehicle-photo-category"
import shipment from "./shipment"
import {VIEW_PERMISSION} from "./delivery-status/config";


const apps = [
  vehicle,
  destination,
  deliveryStatus,
  shipmentType,
  shipmentCompany,
  vehiclePhotoCategory,
  shipment,
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
        ...shipment.navigation(checkPermission),
        ...destination.navigation(checkPermission),
        ...deliveryStatus.navigation(checkPermission),
        ...shipmentType.navigation(checkPermission),
        ...shipmentCompany.navigation(checkPermission),
        ...vehiclePhotoCategory.navigation(checkPermission),
      ],
    },
  ]
}
export default apps