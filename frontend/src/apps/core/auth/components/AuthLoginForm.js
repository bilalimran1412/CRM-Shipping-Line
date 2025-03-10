import {useState} from 'react'
import * as Yup from 'yup'
// form
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
// @mui
import {Link, Stack, Alert, IconButton, InputAdornment} from '@mui/material'
import {LoadingButton} from '@mui/lab'
// auth
import {useAuthContext} from 'auth/useAuthContext'
// components
import Iconify from 'components/iconify'
import FormProvider, {RHFTextField} from 'components/hook-form'

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const {login} = useAuthContext()

  const [showPassword, setShowPassword] = useState(false)

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  })

  const defaultValues = {
    username: 'admin',
    password: 'admin',
  }

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  })

  const {
    reset,
    setError,
    handleSubmit,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = methods

  const onSubmit = async (data) => {
    try {
      await login(data.username, data.password)
    } catch (error) {
      console.error(error)

      reset()

      setError('afterSubmit', {
        ...error,
        message: error.message,
      })
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="username" label="Username"/>

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack alignItems="flex-end" sx={{my: 2}}>
        <Link variant="body2" color="inherit" underline="always">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  )
}
