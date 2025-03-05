import * as yup from "yup";

const validator = (mode, translate) => {
  let password = yup.string().min(8, translate('user.validator.password_min'))
    .transform((v, o) => (o === '' ? null : v)).nullable()
  if (mode === 'create') {
    password = password.required(translate('user.validator.password_required'))
  }
  return yup.object().shape({
    first_name: yup.string().required(translate('user.validator.first_name_required')).nullable(),
    username: yup.string().required(translate('user.validator.username_required'))
      .min(8, translate('user.validator.username_min'))
      .matches(/^[a-zA-Z0-9_]+$/, translate('user.validator.username_invalid'))
      .nullable(),
    email: yup.string().required(translate('user.validator.email_required'))
      .email(translate('user.validator.email_validate')).nullable(),
    password
  })
}


export default validator