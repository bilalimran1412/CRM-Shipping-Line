import user from "../apps/user"
import logistic from "../apps/logistic"
import shimpent from "../apps/shipment"
import finance from "../apps/finance"

const apps = [
  ...logistic,
  ...shimpent,
  ...user,
  ...finance,
]

export default apps