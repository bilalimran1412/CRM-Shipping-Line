import * as yup from "yup";

const validator = (mode, translate) => {
  return yup.object().shape({
    status: yup.string().required(translate('vehicle-task.validator.status_required')).nullable(),
  })
}


export default validator
