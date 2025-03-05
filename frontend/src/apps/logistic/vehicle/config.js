export const APP_NAME = 'vehicle'

export const ROUTE_URL = `logistic/${APP_NAME}`
export const STORE_NAME = APP_NAME
export const NAV_LINK = APP_NAME
export const API_URL = 'logistic/vehicle/'

export const CREATE_PERMISSION = 'logistic.add_vehicle'
export const UPDATE_PERMISSION = 'logistic.change_vehicle'
export const DELETE_PERMISSION = 'logistic.delete_vehicle'
export const VIEW_PERMISSION = 'logistic.view_vehicle'

export const LIST_NAVIGATION = `/${ROUTE_URL}`
export const permissions = {
  create: CREATE_PERMISSION,
  edit: UPDATE_PERMISSION,
  delete: DELETE_PERMISSION,
  view: VIEW_PERMISSION,
}