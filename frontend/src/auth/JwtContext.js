import PropTypes from 'prop-types'
import {createContext, useEffect, useReducer, useCallback, useMemo} from 'react'
// utils
import axios from '../utils/axios'
import localStorageAvailable from '../utils/localStorageAvailable'
//
import {isValidToken, setSession} from './utils'

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
}

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    }
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    }
  }
  if (action.type === 'CHANGE_PROFILE') {
    return {
      ...state,
      user: {
        ...state.user,
        ...action.payload
      },
    }
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    }
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    }
  }

  return state
}

// ----------------------------------------------------------------------

export const AuthContext = createContext(null)

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
}

export function AuthProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const storageAvailable = localStorageAvailable()

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : ''

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken)

        const response = await axios.get('user/account/')

        const {user} = response.data

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user,
          },
        })
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        })
      }
    } catch (error) {
      console.error(error)
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      })
    }
  }, [storageAvailable])

  useEffect(() => {
    initialize()
  }, [initialize])

  // LOGIN
  const changeProfile = useCallback(data => {
    dispatch({
      type: 'CHANGE_PROFILE',
      payload: data,
    })
  }, [])
  const login = useCallback(async (username, password) => {
    const response = await axios.post('user/login/', {
      username,
      password,
    })
    const {access, user} = response.data

    setSession(access)

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    })
  }, [])

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const response = await axios.post('user/register/', {
      email,
      password,
      firstName,
      lastName,
    })
    const {access, user} = response.data

    localStorage.setItem('accessToken', access)

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    })
  }, [])

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null)
    dispatch({
      type: 'LOGOUT',
    })
  }, [])
  // LOGOUT
  const checkPermission = useCallback((permission) => {
    try {
      if (typeof permission === 'function') {
        return state.user.permissions.some(perm => permission(perm))
      }
      return state.user.permissions.some(perm => perm === permission)
    } catch (e) {
      return false
    }
  }, [state])

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      register,
      logout,
      checkPermission,
      changeProfile,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register]
  )

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
}