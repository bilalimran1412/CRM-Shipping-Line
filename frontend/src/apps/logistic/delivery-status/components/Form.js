import {useEffect} from 'react'
// form
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
// @mui
import {LoadingButton} from '@mui/lab'
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
// components
import {useSnackbar} from 'components/snackbar'
import FormProvider, {RHFTextField} from 'components/hook-form'
import {useLocales} from "locales";
import validator from "../validators";
import RHFFileUploadField from "components/hook-form/RHFFileUploadField";
import useApi from "hooks/useApi";
import {store} from "../index";
import {useSettingsContext} from "../../../../components/settings";
// ----------------------------------------------------------------------

export default function Form({isEdit = false, data, formData, onSubmit, isSubmitting}) {
  const {translate, allLangs} = useLocales()
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
    getValues
  } = methods

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
        <Grid item xs={12} md={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{p: 3}}>
                <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                  {translate('delivery-status.form.main_data')}
                </Typography>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                  }}
                >
                  {allLangs.map((item, index) => {
                    return (
                      <RHFTextField
                        key={index}
                        name={`name.${item.value}`}
                        label={`${translate('delivery-status.form.name')} (${item.label})`}
                      />
                    )
                  })}
                </Box>
                <Box
                  sx={{mt: 3}}
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 2fr)',
                  }}
                >
                  <RHFFileUploadField
                    name="icon"
                    type="destination_icon"
                    label={translate('delivery-status.form.icon')}
                  />
                </Box>
                <Stack alignItems="flex-start" sx={{mt: 3}}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? translate('delivery-status.form.create_button') : translate('delivery-status.form.edit_button')}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

    </FormProvider>
  )
}
