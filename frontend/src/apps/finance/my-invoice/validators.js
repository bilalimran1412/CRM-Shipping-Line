import * as yup from "yup";

export const editValidator = (translate) => {
  return yup.object().shape({
    name: yup.string().required(translate('customer-invoice-detail-template.validator.name_required')).nullable(),
    items: yup.array().of(yup.object().shape({
      // description: yup.string().required(translate('customer-invoice-detail-template.validator.description_required')).nullable(),
    })),
  })
}

