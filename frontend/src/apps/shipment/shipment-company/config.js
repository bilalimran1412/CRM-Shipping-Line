export const APP_NAME = 'shipment-company'

export const ROUTE_URL = `shipment/${APP_NAME}`
export const STORE_NAME = APP_NAME
export const NAV_LINK = APP_NAME
export const API_URL = 'logistic/shipment-company/'

export const CREATE_PERMISSION = 'logistic.add_shipmentcompany'
export const UPDATE_PERMISSION = 'logistic.change_shipmentcompany'
export const DELETE_PERMISSION = 'logistic.delete_shipmentcompany'
export const VIEW_PERMISSION = 'logistic.view_shipmentcompany'

export const LIST_NAVIGATION = `/${ROUTE_URL}`
export const permissions = {
  create: CREATE_PERMISSION,
  edit: UPDATE_PERMISSION,
  delete: DELETE_PERMISSION,
  view: VIEW_PERMISSION,
}