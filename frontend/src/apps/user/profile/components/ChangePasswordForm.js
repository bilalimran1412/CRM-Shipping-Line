import PropTypes from 'prop-types'
import * as Yup from 'yup'
import {useCallback, useEffect, useMemo, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
// form
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
// @mui
import {LoadingButton} from '@mui/lab'
import {Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Button, CircularProgress} from '@mui/material'
// utils
import {fData} from 'utils/formatNumber'
// components
import Label from 'components/label'
import {useSnackbar} from 'components/snackbar'
import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from 'components/hook-form'
import RHFPasswordField from "../../../../components/hook-form/RHFPasswordField";
import {useLocales} from "../../../../locales";
import {uploadFile} from "../../../../utils/file";
import Iconify from "../../../../components/iconify";
import validator, {passwordValidator} from "../validators";
import Error from "../../../../components/error";
import useApi from "../../../../hooks/useApi";
import {store} from "../index";
import {searchParamsFromJSON} from "../../../../utils";
import {ROUTE_URL} from "../../user/config";
import {useAuthContext} from "../../../../auth/useAuthContext";

// ----------------------------------------------------------------------
export default function ChangePasswordForm() {
  const navigate = useNavigate()
  const {translate} = useLocales()
  const {enqueueSnackbar} = useSnackbar()
  const {changeProfile} = useAuthContext()
  const {
    customGetRequest,
    customPostRequest,
    isFormLoading,
    dispatch,
    actions,
    formData,
    formError,
    clearFormData,
    createData,
    isSubmitting
  } = useApi(store)
  useEffect(() => {
    dispatch(actions.setFormLoading(true))
    customGetRequest('profile/', {
      success: data => {

        dispatch(actions.setFormData(data))
      },
      error: error => {
        dispatch(actions.setFormError(error))
      }
    })
    return () => {
      clearFormData()
    }
  }, [])

  const methods = useForm({
    resolver: yupResolver(passwordValidator(translate)),
    defaultValues: {},
  })

  useEffect(() => {
    if (formData) {
      reset(formData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    // formState: {isSubmitting},
  } = methods

  const handleError = (errors) => {
    const err = []
    for (let errorItem in errors) {
      errors?.[errorItem]?.forEach?.(error => {
        err.push(translate(`profile.validator.password.${error.code}`))
      })
    }
    if (err.length === 0) {
      return translate('profile.error.password')
    }
    return (
      <div>
        {err.map((item, index) => <div key={index}>{item} <br/></div>)}
      </div>
    )
  }
  const onSubmit = values => {
    dispatch(actions.setSubmitLoading(true))
    const data = {
      ...values,
    }
    customPostRequest('change-password', data, {
      success: data => {
        reset({})
        enqueueSnackbar(translate('profile.success.password'), {
          variant: 'success',
          autoHideDuration: 5 * 1000
        })
        dispatch(actions.setSubmitLoading(false))
      },
      error: e => {
        enqueueSnackbar(handleError(e?.data), {
          variant: 'error',
          autoHideDuration: 5 * 1000
        })
        dispatch(actions.setSubmitLoading(false))
      }
    })
  }


  if (formError) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{p: 3, height: '100%'}}>
            <Error code={formError?.status}/>
          </Card>
        </Grid>
      </Grid>
    )
  }
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {isFormLoading &&
        <div className='loading-block'>
          <CircularProgress color="primary"/>
        </div>
      }
      <Grid container spacing={3}>

        <Grid item xs={12} md={12}>
          <Card sx={{p: 3, height: '100%'}}>
            <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
              {translate('profile.title.change_password')}
            </Typography>
            <Grid container spacing={3}>

              <Grid item xs={12} md={4}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                  }}
                >
                  <RHFPasswordField name="old_password" label={translate('profile.form.old_password')}/>
                  <RHFPasswordField name="new_password" label={translate('profile.form.new_password')}/>
                  <RHFPasswordField name="confirm_password" label={translate('profile.form.confirm_password')}/>
                </Box>
              </Grid>
            </Grid>

            <Stack alignItems="flex-start" sx={{mt: 3}}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {translate('profile.form.save')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
