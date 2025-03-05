import * as yup from "yup";

const validator = (mode, translate) => {
  return yup.object().shape({
    name: yup.object().shape({
      en: yup.string().required(translate('vehicle-photo-category.validator.name_required')).nullable(),
      ru: yup.string().required(translate('vehicle-photo-category.validator.name_required')).nullable(),
    }),
  })
}


export default validator