import {useCallback, useEffect, useRef} from 'react'
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
import FormProvider, {RHFAutocomplete, RHFSwitch, RHFTextField} from 'components/hook-form'
import {useLocales} from "locales";
import {editValidator} from "../validators";
import RHFDateTimeField from "components/hook-form/RHFDateTimeField";
import useApi from "hooks/useApi";
import {store} from "../index";
import {useParams} from "react-router-dom";
import {useSettingsContext} from "components/settings";
// ----------------------------------------------------------------------



export default function CreateForm({isEdit = false, data, formData, onSubmit, isSubmitting}) {
  const {translate, currentLang} = useLocales()
  const {themeMode} = useSettingsContext()
  const {customDetailPostRequest} = useApi(store)
  const {id} = useParams()
  const searchRef = useRef()
  const vehicleListRef = useRef()
  const methods = useForm({
    resolver: yupResolver(editValidator(translate)),
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

  const onSearchVehicle = useCallback(() => {
    const vin = getValues('search.vin')
    if (!vin) return null
    const data = {
      vin: vin
    }
    customDetailPostRequest(id, 'search-vehicle', data, {
      success: data => {
        searchRef.current.setData(data)
      },
      error: e => {

      }
    })
  }, [methods])
  const onAppend = (data) => {
    vehicleListRef.current.append({vehicle: data})
  }
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{p: 3, height: '100%'}}>
                <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                  {translate('vehicle_task.form.main_data')}
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
                  <RHFTextField
                    size="small"
                    name={`name`}
                    label={translate('vehicle_task.form.name')}
                  />
                  <RHFAutocomplete
                    name="task_type"
                    label={translate('vehicle_task.form.task_type')}
                    size={'small'}
                    options={formData?.task_types?.map?.((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                  />
                  <RHFDateTimeField
                    size={'small'}
                    name={`datetime`}
                    label={translate('vehicle_task.form.datetime')}
                  />
                  <RHFAutocomplete
                    name="status"
                    label={translate('vehicle_task.form.status')}
                    size={'small'}
                    options={formData?.statuses?.map?.((item) => ({
                      label: item.label.en,
                      value: item.value,
                    }))}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                  />
                  <RHFTextField
                    size="small"
                    name={`note`}
                    label={translate('vehicle_task.form.note')}
                  />
                  <RHFAutocomplete
                    name="assigned_to"
                    label={translate('vehicle_task.form.assigned_to')}
                    size={'small'}
                    options={formData?.employees?.map?.((item) => ({
                      label: item.full_name,
                      value: item.id,
                    }))}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
            <Card sx={{p: 3, mt: 3}}>
              <Stack alignItems="flex-end">
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? translate('vehicle_task.form.create_button') : translate('vehicle_task.form.edit_button')}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
    </FormProvider>
  )
}