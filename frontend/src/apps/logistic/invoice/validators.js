import * as yup from "yup";

export const createValidator = (translate) => {
  return yup.object().shape({
    name: yup.string().required(translate('invoice.validator.name_required')).nullable(),
    template: yup.string().required(translate('invoice.validator.template_required')).nullable(),
  })
}
export const editValidator = (translate) => {
  return yup.object().shape({
    name: yup.string().required(translate('invoice.validator.name_required')).nullable(),
    datetime: yup.string().required(translate('invoice.validator.datetime_required')).nullable()
  })
}