import * as yup from "yup";

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