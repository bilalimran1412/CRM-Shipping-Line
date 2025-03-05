import * as yup from "yup";

const validator = (mode, translate) => {
  return yup.object().shape({
    title: yup.string().required(translate('group.validator.title_required')).nullable(),
    name: yup.string().required(translate('group.validator.name_required')).nullable(),
  })
}


export default validator