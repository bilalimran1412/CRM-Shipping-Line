import * as yup from "yup";

export const createValidator = (translate) => {
  return yup.object().shape({
    shipment_type: yup.string().required(translate('shipment.validator.shipment_type_required')).nullable(),
  })
}
export const editValidator = (translate) => {
  return yup.object().shape({
    company: yup.string().required(translate('shipment.validator.company_required')).nullable(),
    completed: yup.boolean().required(translate('shipment.validator.completed_required')),
    complete_datetime: yup.date().when('completed', {
      is: true,
      then: yup.date().required(translate('shipment.validator.complete_datetime_required')).nullable(),
      otherwise: yup.date().nullable()
    }),
    documents: yup.array().of(yup.object().shape({
      name: yup.string().required(translate('shipment.validator.documents.name_required')).nullable(),
      file: yup.object().required(translate('shipment.validator.documents.file_required')).nullable(),
    })),
  })
}

