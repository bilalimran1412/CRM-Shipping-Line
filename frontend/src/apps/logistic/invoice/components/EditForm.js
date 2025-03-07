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
import VehicleSearch from "./VehicleSearch";
import VehicleList from "./VehicleList";
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
                  {translate('invoice.form.main_data')}
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
                    label={translate('invoice.form.name')}
                  />
                  <RHFAutocomplete
                    name="template"
                    label={`Template`}
                    size={'small'}
                    disabled
                    options={formData?.templates?.map?.((item) => {
                      console.log(item)
                      return {
                        label: item,
                        value: item,
                      }
                    })}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                  />
                  <RHFDateTimeField
                    size={'small'}
                    name={`datetime`}
                    label={'date and Time'}
                  />
                  <RHFTextField
                    size="small"
                    name={`data.consignee`}
                    label={`consignee`}
                  />
                  <RHFTextField
                    size="small"
                    name={`data.destination`}
                    label={`destination`}
                  />
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{p: 3,height: '100%'}}>
                <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                  {`Invoice header and footer`}
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
                    multiline
                    rows={6}
                    size="small"
                    name={`data.header`}
                    label={`header`}
                  />
                  <RHFTextField
                    multiline
                    rows={6}
                    size="small"
                    name={`data.footer`}
                    label={`footer`}
                  />
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={12}>
              <Card sx={{p: 3}}>
                <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                  {`search vehicle`}
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
                    name="search.vin"
                    label={`VIN number`}
                    size={'small'}
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        e.preventDefault()
                        onSearchVehicle()
                      }
                    }}
                  />
                </Box>
                <Stack alignItems="flex-start" sx={{mt: 2}}>
                  <LoadingButton variant="contained" onClick={onSearchVehicle}>
                    {`submit`}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
          <VehicleSearch ref={searchRef} onAppend={onAppend}/>
          <VehicleList ref={vehicleListRef}/>
          <Card sx={{p: 3, mt: 3}}>
            <Stack alignItems="flex-end">
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('invoice.form.create_button') : translate('invoice.form.edit_button')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

    </FormProvider>
  )
}