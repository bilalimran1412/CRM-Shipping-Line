export const APP_NAME = 'customer-invoice'

export const ROUTE_URL = `finance/${APP_NAME}`
export const STORE_NAME = APP_NAME
export const NAV_LINK = APP_NAME
export const API_URL = 'finance/customer-invoice/'

export const CREATE_PERMISSION = 'finance.add_customerinvoice'
export const UPDATE_PERMISSION = 'finance.change_customerinvoice'
export const DELETE_PERMISSION = 'finance.delete_customerinvoice'
export const VIEW_PERMISSION = 'finance.view_customerinvoice'
export const DOWNLOAD_PERMISSION = 'finance.generate_customerinvoice'

export const LIST_NAVIGATION = `/${ROUTE_URL}`
export const permissions = {
  create: CREATE_PERMISSION,
  edit: UPDATE_PERMISSION,
  delete: DELETE_PERMISSION,
  view: VIEW_PERMISSION,
  download: DOWNLOAD_PERMISSION,
}
