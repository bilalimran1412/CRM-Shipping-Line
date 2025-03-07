export const APP_NAME = 'invoice'

export const ROUTE_URL = `logistic/${APP_NAME}`
export const STORE_NAME = APP_NAME
export const NAV_LINK = APP_NAME
export const API_URL = 'logistic/invoice/'

export const CREATE_PERMISSION = 'logistic.add_invoice'
export const UPDATE_PERMISSION = 'logistic.change_invoice'
export const DELETE_PERMISSION = 'logistic.delete_invoice'
export const VIEW_PERMISSION = 'logistic.view_invoice'
export const DOWNLOAD_PERMISSION = 'logistic.download_invoice'

export const LIST_NAVIGATION = `/${ROUTE_URL}`
export const permissions = {
  create: CREATE_PERMISSION,
  edit: UPDATE_PERMISSION,
  delete: DELETE_PERMISSION,
  view: VIEW_PERMISSION,
download: DOWNLOAD_PERMISSION,
}