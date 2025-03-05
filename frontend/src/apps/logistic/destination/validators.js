import * as yup from "yup";

const validator = (mode, translate) => {
  return yup.object().shape({
    country: yup.object().shape({
      en: yup.string().required(translate('destination.validator.country_required')).nullable(),
      ru: yup.string().required(translate('destination.validator.country_required')).nullable(),
    }),
    city: yup.object().shape({
      en: yup.string().required(translate('destination.validator.city_required')).nullable(),
      ru: yup.string().required(translate('destination.validator.city_required')).nullable(),
    }),
  })
}


export default validator