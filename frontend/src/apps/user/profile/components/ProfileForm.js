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
import validator from "../validators";
import Error from "../../../../components/error";
import useApi from "../../../../hooks/useApi";
import {store} from "../index";
import {searchParamsFromJSON} from "../../../../utils";
import {ROUTE_URL} from "../../user/config";
import {useAuthContext} from "../../../../auth/useAuthContext";

// ----------------------------------------------------------------------
export default function ProfileForm() {
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
    resolver: yupResolver(validator(translate)),
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

  const values = watch()
  const avatarRef = useRef()

  const handleDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) return null
      avatarRef.current.setLoading(true)
      const file = acceptedFiles[0]
      uploadFile({
        file,
        type: 'avatar',
        success: data => {
          console.log('success', data)
          setValue('avatar', data, {shouldValidate: true})
          avatarRef.current.setLoading(false)
        },
        error: error => {
          console.log('error', error)
          avatarRef.current.setLoading(false)
          enqueueSnackbar(translate('profile.error.avatar'), {
            variant: 'error',
            autoHideDuration: 5 * 1000
          })
        },
      })
    },
    [setValue]
  )


  const onSubmit = values => {
    dispatch(actions.setSubmitLoading(true))
    const data = {
      ...values,
      avatar: values?.avatar?.id || null,
    }
    customPostRequest('change-profile', data, {
      success: data => {
        changeProfile(data)
        enqueueSnackbar(translate('profile.success.edit'), {
          variant: 'success',
          autoHideDuration: 5 * 1000
        })
        // const params = searchParamsFromJSON(searchParams)
        // navigate(`/${ROUTE_URL}${params}`)
        dispatch(actions.setSubmitLoading(false))
      },
      error: e => {
        enqueueSnackbar(translate('profile.error.edit'), {
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
        <Grid item xs={12} md={4}>
          <Card sx={{p: 3, height: '100%'}}>
            <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
              {translate('profile.title.avatar')}
            </Typography>
            <Box sx={{mb: 5}}>
              <RHFUploadAvatar
                ref={avatarRef}
                name="avatar.thumb"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={value => {
                  return (

                    <Box sx={{mb: 1, mt: 2}} className='center-col-flexbox'>
                      {value &&
                        <Button
                          variant={'outlined'}
                          size={'small'}
                          color="error"
                          startIcon={<Iconify icon="eva:trash-2-outline"/>}
                          onClick={() => {
                            setValue('avatar.id', null)
                            setValue('avatar.thumb', null)
                          }}
                        >
                          {translate('avatar_delete')}
                        </Button>
                      }
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        {translate('avatar_allowed_types')}
                        <br/>
                        {translate('avatar_max_size')} {fData(3145728)}
                      </Typography>
                    </Box>
                  )
                }}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{p: 3, height: '100%'}}>
            <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
              {translate('profile.title.user_data')}
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="first_name" label={translate('profile.form.first_name')}/>
              <RHFTextField name="last_name" label={translate('profile.form.last_name')}/>
              <RHFTextField name="username" disabled label={translate('profile.form.username')}/>
              <RHFTextField name="email" label={translate('profile.form.email')}/>
              <RHFTextField name="phone" label={translate('profile.form.phone')}/>
            </Box>

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
