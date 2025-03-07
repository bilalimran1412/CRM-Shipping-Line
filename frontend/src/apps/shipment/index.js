import SvgColor from "../../components/svg-color";
import shipmentType from "./shipment-type"
import shipmentCompany from "./shipment-company"
import shipment from "./shipment"
import VechileTaskType from './vechile-task-type'


const apps = [
  shipmentType,
  shipmentCompany,
  shipment,
  VechileTaskType
]

export const navigation = (checkPermission) => {
  return [
    {
      ignoreSearchbar: true,
      title: 'navigation.shipment',
      path: `/shipment`,
      permission: checkPermission(perm => perm.includes('shipment')),
      children: [
        ...shipment.navigation(checkPermission),
        ...shipmentType.navigation(checkPermission),
        ...shipmentCompany.navigation(checkPermission),
        ...VechileTaskType.navigation(checkPermission),
      ],
    },
  ]
}
export default apps