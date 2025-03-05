import apps from "configs/apps"


const route = (checkPermission) => {
  const routeConfig = []

  apps.filter(app => !!app.routes).forEach(app => {
    if (typeof app.routes == 'function') {
      routeConfig.push(...app.routes(checkPermission))
    } else {
      routeConfig.push(...app.routes)
    }
  })

  return routeConfig
}
export default route