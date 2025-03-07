import user from "../apps/user"
import logistic from "../apps/logistic"
import shimpent from "../apps/shipment"

const apps = [
  ...logistic,
  ...shimpent,
  ...user,
]

export default apps