import * as yup from "yup";

const validator = (mode, translate) => {
  return yup.object().shape({
    name: yup.string().required(translate('shipment-company.validator.name_required')).nullable(),
  })
}


export default validator