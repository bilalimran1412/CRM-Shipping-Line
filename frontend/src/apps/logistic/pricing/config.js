export const APP_NAME = 'pricing'

export const ROUTE_URL = `logistic/${APP_NAME}`
export const STORE_NAME = APP_NAME
export const NAV_LINK = APP_NAME
export const API_URL = 'logistic/pricing/'

export const CREATE_PERMISSION = 'logistic.add_pricing'
export const UPDATE_PERMISSION = 'logistic.change_pricing'
export const DELETE_PERMISSION = 'logistic.delete_pricing'
export const VIEW_PERMISSION = 'logistic.view_pricing'
export const DOWNLOAD_PERMISSION = 'logistic.download_customerinvoice'

export const LIST_NAVIGATION = `/${ROUTE_URL}`
export const permissions = {
  create: CREATE_PERMISSION,
  edit: UPDATE_PERMISSION,
  delete: DELETE_PERMISSION,
  view: VIEW_PERMISSION,
  download: DOWNLOAD_PERMISSION,
}
