import PropTypes from 'prop-types'
import * as Yup from 'yup'
import {useCallback, useEffect, useMemo, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
// form
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
// @mui
import {LoadingButton} from '@mui/lab'
import {Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Button} from '@mui/material'
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

// ----------------------------------------------------------------------

Form.propTypes = {
  isEdit: PropTypes.bool,
  data: PropTypes.object,
}

export default function Form({isEdit = false, data, formData, onSubmit, isSubmitting}) {
  const navigate = useNavigate()
  const {translate} = useLocales()
  const {enqueueSnackbar} = useSnackbar()

  const methods = useForm({
    resolver: yupResolver(validator(isEdit ? 'edit' : 'create', translate)),
    defaultValues: data,
  })

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

  useEffect(() => {
    if (isEdit && data) {
      reset(data)
    }
    if (!isEdit) {
      reset(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, data])

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
          enqueueSnackbar(translate('user.error.avatar'), {
            variant: 'error',
            autoHideDuration: 5 * 1000
          })
        },
      })
    },
    [setValue]
  )

  const groups = useMemo(() => {
    if (formData?.groups && Array.isArray(formData.groups)) {
      return formData.groups.map(({id, title}) => ({
        value: id,
        label: title
      }))
    }
    return []
  }, [formData])
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{p: 3}}>
            <Box sx={{mx: 0, width: 1, display: 'flex', justifyContent: 'space-between'}}>
              <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                {translate('user.title.avatar')}
              </Typography>
              <Label
                color={values.is_active ? 'success' : 'error'}
                // sx={{textTransform: 'uppercase', position: 'absolute', top: 24, right: 24}}
              >
                {values.is_active ? translate('user.active') : translate('user.not_active')}
              </Label>
            </Box>

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

            <RHFSwitch
              name="is_active"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{mb: 0.5}}>
                    {translate('user.form.is_active')}
                  </Typography>
                </>
              }
              sx={{mx: 0, width: 1, justifyContent: 'space-between'}}
            />
            <RHFSwitch
              name="is_staff"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{mb: 0.5}}>
                    {translate('user.form.is_staff')}
                  </Typography>
                </>
              }
              sx={{mx: 0, width: 1, justifyContent: 'space-between'}}
            />
            <RHFSwitch
              name="is_superuser"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{mb: 0.5}}>
                    {translate('user.form.is_superuser')}
                  </Typography>
                </>
              }
              sx={{mx: 0, width: 1, justifyContent: 'space-between'}}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{p: 3}}>
            <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
              {translate('user.title.user_data')}
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
              <RHFTextField name="first_name" label={translate('user.form.first_name')}/>
              <RHFTextField name="last_name" label={translate('user.form.last_name')}/>
              <RHFTextField name="username" label={translate('user.form.username')}/>
              <RHFTextField name="email" label={translate('user.form.email')}/>
              <RHFTextField name="phone" label={translate('user.form.phone')}/>
              <RHFAutocomplete
                name="groups"
                label={translate('user.form.groups')}
                options={groups}
                multiple
                fullWidth
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                filterSelectedOptions
                onChange={value => setValue('groups', value.map(({value}) => value))}
              />
              <RHFPasswordField name="password" label={translate('user.form.password')}/>


            </Box>

            <Stack alignItems="flex-end" sx={{mt: 3}}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('user.form.create_button') : translate('user.form.edit_button')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
