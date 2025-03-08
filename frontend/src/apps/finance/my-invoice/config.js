export const APP_NAME = 'my-invoice'

export const ROUTE_URL = `finance/${APP_NAME}`
export const STORE_NAME = APP_NAME
export const NAV_LINK = APP_NAME
export const API_URL = 'finance/customer-invoice/my/'

export const CREATE_PERMISSION = ''
export const UPDATE_PERMISSION = ''
export const DELETE_PERMISSION = ''
export const VIEW_PERMISSION = 'finance.view_my_invoices'

export const LIST_NAVIGATION = `/${ROUTE_URL}`
export const permissions = {
  create: CREATE_PERMISSION,
  edit: UPDATE_PERMISSION,
  delete: DELETE_PERMISSION,
  view: VIEW_PERMISSION,
}
