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



  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{p: 3}}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField name="title" label={translate('group.form.title')}/>
              <RHFTextField name="name" label={translate('group.form.name')}/>
            </Box>

            <Stack alignItems="flex-start" sx={{mt: 3}}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('group.form.create_button') : translate('group.form.edit_button')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
