import * as yup from "yup";

export const validator = (translate) => {
  return yup.object().shape({
    date: yup.string().required(translate('pricing.validator.date_required')).nullable(),
    type: yup.string().required(translate('pricing.validator.type_required')).nullable(),
    file: yup.object().required(translate('pricing.validator.file_required')).nullable(),
  })
}
export const createValidator = (translate) => {
  return yup.object().shape({
    name: yup.string().required(translate('customerinvoice.validator.name_required')).nullable(),
  })
}
export const editValidator = (translate) => {
  return yup.object().shape({
    name: yup.string().required(translate('customerinvoice.validator.name_required')).nullable(),
  })
}