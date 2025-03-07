export const APP_NAME = 'vehicle-task-type'

export const ROUTE_URL = `shipment/${APP_NAME}`
export const STORE_NAME = APP_NAME
export const NAV_LINK = APP_NAME
export const API_URL = 'logistic/vehicle-task-type/'

export const CREATE_PERMISSION = 'logistic.add_vehicletasktype'
export const UPDATE_PERMISSION = 'logistic.change_vehicletasktype'
export const DELETE_PERMISSION = 'logistic.delete_vehicletasktype'
export const VIEW_PERMISSION = 'logistic.view_vehicletasktype'

export const LIST_NAVIGATION = `/${ROUTE_URL}`
export const permissions = {
  create: CREATE_PERMISSION,
  edit: UPDATE_PERMISSION,
  delete: DELETE_PERMISSION,
  view: VIEW_PERMISSION,
}