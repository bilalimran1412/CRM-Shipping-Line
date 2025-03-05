export const APP_NAME = 'group'

export const ROUTE_URL = `user/${APP_NAME}`
export const STORE_NAME = APP_NAME
export const NAV_LINK = APP_NAME
export const API_URL = 'user/group/'

export const CREATE_PERMISSION = 'auth.add_group'
export const UPDATE_PERMISSION = 'auth.change_group'
export const DELETE_PERMISSION = 'auth.delete_group'
export const VIEW_PERMISSION = 'auth.view_group'

export const LIST_NAVIGATION = `/${ROUTE_URL}`
export const permissions = {
  create: CREATE_PERMISSION,
  edit: UPDATE_PERMISSION,
  delete: DELETE_PERMISSION,
  view: VIEW_PERMISSION,
}