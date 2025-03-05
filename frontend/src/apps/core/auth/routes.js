import {Navigate} from "react-router-dom"
import {PATH_AFTER_LOGIN} from "config-global"
import GuestGuard from "auth/GuestGuard"
import {LoginPage} from "routes/elements"

export default [
  {
    path: '/',
    children: [
      {element: <Navigate to={PATH_AFTER_LOGIN} replace/>, index: true},
      {
        path: 'login',
        element: (
          <GuestGuard>
            <LoginPage/>
          </GuestGuard>
        ),
      },
    ],
  },
]