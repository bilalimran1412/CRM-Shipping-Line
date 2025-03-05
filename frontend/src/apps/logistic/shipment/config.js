export const APP_NAME = 'shipment'

export const ROUTE_URL = `logistic/${APP_NAME}`
export const STORE_NAME = APP_NAME
export const NAV_LINK = APP_NAME
export const API_URL = 'logistic/shipment/'

export const CREATE_PERMISSION = 'logistic.add_shipment'
export const UPDATE_PERMISSION = 'logistic.change_shipment'
export const DELETE_PERMISSION = 'logistic.delete_shipment'
export const VIEW_PERMISSION = 'logistic.view_shipment'

export const LIST_NAVIGATION = `/${ROUTE_URL}`
export const permissions = {
  create: CREATE_PERMISSION,
  edit: UPDATE_PERMISSION,
  delete: DELETE_PERMISSION,
  view: VIEW_PERMISSION,
}