import * as yup from "yup";

const validator = (translate) => {
  let password = yup.string().min(8, translate('profile.validator.password_min'))
    .transform((v, o) => (o === '' ? null : v)).nullable()
  return yup.object().shape({
    first_name: yup.string().required(translate('profile.validator.first_name_required')).nullable(),
    // username: yup.string().required(translate('profile.validator.username_required'))
    //   .min(8, translate('profile.validator.username_min'))
    //   .matches(/^[a-zA-Z0-9_]+$/, translate('profile.validator.username_invalid'))
    //   .nullable(),
    email: yup.string().required(translate('profile.validator.email_required'))
      .email(translate('profile.validator.email_validate')).nullable(),
    password
  })
}
export const passwordValidator = (translate) => {
  return yup.object().shape({
    old_password: yup
      .string()
      .required(translate('profile.validator.old_password_required')),
    new_password: yup
      .string()
      .min(8, translate('profile.validator.new_password_min'))
      .required(),
    confirm_password: yup.string()
      .test('passwords-match', translate('profile.validator.passwords_not_match'), function (value) {
        return this.parent.new_password === value
      })
  })
}


export default validator