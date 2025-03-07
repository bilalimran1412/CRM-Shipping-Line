import routes from './routes'
import navigation from './navigation'
import locale from './locale'
import {createApiStore} from "redux/apiStore"
import {STORE_NAME, API_URL, APP_NAME} from "./config"

export const store = createApiStore(STORE_NAME, API_URL)
const app = {
  name: APP_NAME,
  store,
  routes,
  navigation,
  locale,
}

export default app