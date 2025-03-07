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
import Documents from "./Documents";
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
    const shipmentType = getValues('shipment_type')
    if (!vin) return null
    const data = {
      vin: vin,
      shipment_type: shipmentType,
      vehicle_without_current_shipment_type: getValues('search.vehicle_without_current_shipment_type'),
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
              <Card sx={{p: 3}}>
                <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                  {translate('shipment.form.main_data')}
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
                  <RHFAutocomplete
                    name="shipment_type"
                    label={translate('shipment.form.shipment_type')}
                    size={'small'}
                    options={formData?.shipment_type?.map?.((item) => {
                      return {
                        label: item.name?.[currentLang.value],
                        value: item.id,
                      }
                    })}
                    disabled
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                  />
                  <RHFAutocomplete
                    name="company"
                    label={translate('shipment.form.company')}
                    size={'small'}
                    options={formData?.company?.map?.((item) => {
                      return {
                        label: item.name,
                        value: item.id,
                      }
                    })}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                  />
                  <RHFDateTimeField
                    size={'small'}
                    name={`datetime`}
                    label={translate('shipment.form.datetime')}
                  />
                </Box>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  sx={{mt: 3}}
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >

                  <RHFDateTimeField
                    size={'small'}
                    name={`complete_datetime`}
                    label={translate('shipment.form.complete_datetime')}
                  />
                  <RHFSwitch
                    name="completed"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{mb: 0.5, ml: 0.3}}>
                        {translate('shipment.form.completed')}
                      </Typography>
                    }
                    sx={{mx: 0, width: 1, justifyContent: 'space-between'}}
                  />
                </Box>

              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{p: 3, height: '100%'}}>
                <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                  {translate('shipment.form.search.title')}
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
                    label={translate('shipment.form.search.vin')}
                    size={'small'}
                  />
                </Box>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  sx={{mt: 3}}
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                  }}
                >
                  <RHFSwitch
                    name="search.vehicle_without_current_shipment_type"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{mb: 0.5, ml: 0.3}}>
                        {translate('shipment.form.search.vehicle_without_current_shipment_type')}
                      </Typography>
                    }
                    sx={{mx: 0, width: 1, justifyContent: 'space-between'}}
                  />
                </Box>
                <Stack alignItems="flex-start" sx={{mt: 2}}>
                  <LoadingButton variant="contained" onClick={onSearchVehicle}>
                    {translate('shipment.form.search.submit')}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
          <VehicleSearch ref={searchRef} onAppend={onAppend}/>
          <VehicleList ref={vehicleListRef}/>
          <Card sx={{p: 3, mt: 2}}>
            <Documents formData={formData}/>
          </Card>
          <Card sx={{p: 3, mt: 3}}>
            <Stack alignItems="flex-end">
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('shipment.form.create_button') : translate('shipment.form.edit_button')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

    </FormProvider>
  )
}
