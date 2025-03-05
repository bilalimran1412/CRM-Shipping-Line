export const APP_NAME = 'delivery-status'

export const ROUTE_URL = `logistic/${APP_NAME}`
export const STORE_NAME = APP_NAME
export const NAV_LINK = APP_NAME
export const API_URL = 'logistic/delivery-status/'

export const CREATE_PERMISSION = 'logistic.add_deliverystatus'
export const UPDATE_PERMISSION = 'logistic.change_deliverystatus'
export const DELETE_PERMISSION = 'logistic.delete_deliverystatus'
export const VIEW_PERMISSION = 'logistic.view_deliverystatus'

export const LIST_NAVIGATION = `/${ROUTE_URL}`
export const permissions = {
  create: CREATE_PERMISSION,
  edit: UPDATE_PERMISSION,
  delete: DELETE_PERMISSION,
  view: VIEW_PERMISSION,
}