export const APP_NAME = 'my-vehicle-task'

export const ROUTE_URL = `logistic/${APP_NAME}`
export const STORE_NAME = APP_NAME
export const NAV_LINK = APP_NAME
export const API_URL = 'logistic/vehicle-task/' 

export const UPDATE_PERMISSION = 'logistic.change_vehicle_task'
export const DELETE_PERMISSION = 'logistic.delete_vehicle_task'
export const VIEW_PERMISSION = 'logistic.view_pricing'

export const LIST_NAVIGATION = `/${ROUTE_URL}`
export const permissions = {
  edit: UPDATE_PERMISSION,
  delete: DELETE_PERMISSION,
  view: VIEW_PERMISSION,
}