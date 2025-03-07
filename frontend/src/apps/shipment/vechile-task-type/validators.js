import * as yup from "yup";

const validator = (mode, translate) => {
  return yup.object().shape({
    name: yup.object().shape({
      en: yup.string().required(translate('vehicle-task-type.validator.name_required')).nullable(),
      ru: yup.string().required(translate('vehicle-task-type.validator.name_required')).nullable(),
    }),
    initial_status: yup.string().required(translate('vehicle-task-type.validator.initial_status_required')).nullable(),
  })
}


export default validator