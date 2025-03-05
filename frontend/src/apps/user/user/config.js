export const APP_NAME = 'user'

export const ROUTE_URL = `${APP_NAME}/user`
export const STORE_NAME = APP_NAME
export const NAV_LINK = APP_NAME
export const API_URL = 'user/user/'

export const CREATE_PERMISSION = 'user.add_user'
export const UPDATE_PERMISSION = 'user.change_user'
export const DELETE_PERMISSION = 'user.delete_user'
export const VIEW_PERMISSION = 'user.view_user'

export const LIST_NAVIGATION = `/${ROUTE_URL}`
export const permissions = {
  create: CREATE_PERMISSION,
  edit: UPDATE_PERMISSION,
  delete: DELETE_PERMISSION,
  view: VIEW_PERMISSION,
}