export const APP_NAME = 'vehicle-task'

export const ROUTE_URL = `logistic/${APP_NAME}`
export const STORE_NAME = APP_NAME
export const NAV_LINK = APP_NAME
export const API_URL = 'logistic/vehicle-task/'

export const UPDATE_PERMISSION = 'logistic.change_vehicletask'
export const DELETE_PERMISSION = 'logistic.delete_vehicletask'
export const VIEW_PERMISSION = 'logistic.view_vehicletask'

export const LIST_NAVIGATION = `/${ROUTE_URL}`
export const permissions = {
  edit: UPDATE_PERMISSION,
  delete: DELETE_PERMISSION,
  view: VIEW_PERMISSION,
}