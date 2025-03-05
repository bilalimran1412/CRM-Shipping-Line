import {combineReducers} from 'redux'
import apps from "configs/apps"
// import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// ----------------------------------------------------------------------
export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
}

let reducers = {}

apps.forEach(app => {
  if (app.store && Array.isArray(app.store)) {
    app.store.forEach(innerApp => {
      reducers[innerApp.name] = innerApp.reducer
    })
  } else {
    if (app.store) {
      reducers[app.store.name] = app.store.reducer
    }
  }
})
const rootReducer = combineReducers(reducers)
export default rootReducer
