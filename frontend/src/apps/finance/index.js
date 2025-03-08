import SvgColor from "../../components/svg-color";
import customerInvoice from "./customer-invoice";
import customerInvoiceDetailTemplate from "./customer-invoice-detail-template";
import myInvoice from "./my-invoice";


const apps = [
  customerInvoice,
  customerInvoiceDetailTemplate,
  myInvoice,
]

export const navigation = (checkPermission) => {
  return [
    {
      ignoreSearchbar: true,
      title: 'navigation.finance',
      path: `/finance`,
      permission: checkPermission(perm => perm.includes('finance')),
      children: [
        ...(customerInvoice.navigation(checkPermission)[0]?.permission ? customerInvoice.navigation(checkPermission) : []),
        ...(myInvoice.navigation(checkPermission)[0]?.permission ? myInvoice.navigation(checkPermission) : []),
      ],
    },
  ]
}
export default apps