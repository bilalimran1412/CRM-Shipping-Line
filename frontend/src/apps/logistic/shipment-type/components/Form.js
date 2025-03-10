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
import FormProvider, {RHFAutocomplete, RHFTextField} from 'components/hook-form'
import {useLocales} from "locales";
import validator from "../validators";
import RHFFileUploadField from "components/hook-form/RHFFileUploadField";
// ----------------------------------------------------------------------


export default function Form({isEdit = false, data, formData, onSubmit, isSubmitting}) {
  const {translate, allLangs, currentLang} = useLocales()
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
                  {translate('shipment-type.form.main_data')}
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
                        label={`${translate('shipment-type.form.name')} (${item.label})`}
                      />
                    )
                  })}
                  <RHFAutocomplete
                    name="initial_status"
                    label={translate('shipment-type.form.initial_status')}
                    options={formData?.status?.map?.((item) => {
                      return {
                        label: item.name?.[currentLang.value],
                        value: item.id,
                      }
                    })}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    // onChange={value => onFilterChange('status', value.map(({value}) => value).join(','))}
                  />
                  <RHFAutocomplete
                    name="complete_status"
                    label={translate('shipment-type.form.complete_status')}
                    options={formData?.status?.map?.((item) => {
                      return {
                        label: item.name?.[currentLang.value],
                        value: item.id,
                      }
                    })}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    // onChange={value => onFilterChange('status', value.map(({value}) => value).join(','))}
                  />
                  <RHFFileUploadField
                    name="icon"
                    type="destination_icon"
                    label={translate('shipment-type.form.icon')}
                  />
                </Box>
                <Stack alignItems="flex-start" sx={{mt: 3}}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? translate('shipment-type.form.create_button') : translate('shipment-type.form.edit_button')}
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
