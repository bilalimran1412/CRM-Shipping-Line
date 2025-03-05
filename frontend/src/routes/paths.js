// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`
}

const ROOTS_DASHBOARD = '/dashboard'

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
}
export const MAIN_NAVIGATION_ROOT = '/'
export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  one: path(ROOTS_DASHBOARD, '/one'),
  two: path(ROOTS_DASHBOARD, '/two'),
  three: path(ROOTS_DASHBOARD, '/three'),
  user: {
    root: path(ROOTS_DASHBOARD, '/residentData'),
    four: path(ROOTS_DASHBOARD, '/residentData/four'),
    five: path(ROOTS_DASHBOARD, '/residentData/five'),
    six: path(ROOTS_DASHBOARD, '/residentData/six'),
  },
}
