import * as yup from "yup";

const validator = (mode, translate) => {
  return yup.object().shape({
    manufacturer: yup.string().required(translate('vehicle.validator.manufacturer_required')).nullable(),
    model: yup.string().required(translate('vehicle.validator.model_required')).nullable(),
    vin: yup.string().required(translate('vehicle.validator.vin_required')).nullable(),
    characteristics: yup.object().shape({
      year: yup.string().required(translate('vehicle.validator.characteristics.year_required')).nullable(),
      color: yup.string().required(translate('vehicle.validator.characteristics.color_required')).nullable(),
    }),
    history: yup.array().of(yup.object().shape({
      status: yup.string().required(translate('vehicle.validator.history.status_required')).nullable(),
      datetime: yup.string().required(translate('vehicle.validator.history.datetime_required')).nullable(),
    })),
    documents: yup.array().of(yup.object().shape({
      name: yup.string().required(translate('vehicle.validator.documents.name_required')).nullable(),
      file: yup.object().required(translate('vehicle.validator.documents.file_required')).nullable(),
    })),
  })
}


export default validator