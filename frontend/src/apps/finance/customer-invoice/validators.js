import * as yup from "yup";

export const createValidator = (translate) => {
  return yup.object().shape({
    name: yup.string().required(translate('customer-invoice.validator.name_required')).nullable(),
    // template: yup.string().required(translate('customer-invoice.validator.template_required')).nullable(),
  })
}
export const editValidator = (translate) => {
  return yup.object().shape({
    name: yup.string().required(translate('customer-invoice.validator.name_required')).nullable(),
    customer: yup.string().required(translate('customer-invoice.validator.customer_required')).nullable(),
    datetime: yup.string().required(translate('customer-invoice.validator.datetime_required')).nullable(),
    // template: yup.string().required(translate('customer-invoice.validator.template_required')).nullable(),
  })
}

