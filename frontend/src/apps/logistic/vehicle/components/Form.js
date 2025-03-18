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
import FormProvider, {RHFAutocomplete, RHFTextField} from 'components/hook-form'
import {useLocales} from "locales";
import validator from "../validators";
import DeliveryHistory from "./DeliveryHistory";
import VehiclePhoto from "./VehiclePhoto";
import Documents from "./Documents";
// ----------------------------------------------------------------------


export default function Form({isEdit = false, data, formData, onSubmit, isSubmitting}) {
  const {translate, currentLang} = useLocales()
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
            <Grid item xs={12} md={4}>
              <Card sx={{p: 3, height: '100%'}}>
                <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                  {translate('vehicle.form.main_data')}
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
                    name="manufacturer"
                    label={translate('vehicle.form.manufacturer')}
                    size={'small'}
                  />
                  <RHFTextField
                    name="model"
                    label={translate('vehicle.form.model')}
                    size={'small'}
                  />
                  <RHFTextField
                    name="vin"
                    label={translate('vehicle.form.vin')}
                    size={'small'}
                  />

                  <RHFAutocomplete
                    name="customer"
                    label={translate('vehicle.form.customer')}
                    size={'small'}
                    options={formData?.customer?.map?.((item) => {
                      return {
                        label: item.full_name,
                        value: item.id,
                      }
                    })}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                  />
                  <RHFAutocomplete
                    name="destination"
                    label={translate('vehicle.form.destination')}
                    size={'small'}
                    options={formData?.destination?.map?.((item) => {
                      return {
                        label: `${item.country?.[currentLang.value]}, ${item.city?.[currentLang.value]}`,
                        value: item.id,
                      }
                    })}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    // onChange={value => onFilterChange('status', value.map(({value}) => value).join(','))}
                  />
                  
                  <RHFTextField
                    name="container_no"
                    label={translate('vehicle.form.container_no')}
                    size={'small'}
                  />
                  <RHFAutocomplete
                    name="is_key"
                    label={translate('vehicle.form.is_key')}
                    size={'small'}
                    options={[
                      { label: 'Yes', value: true },
                      { label: 'No', value: false }
                    ]}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value}
                  />
                  <RHFAutocomplete
                    name="is_hybrid"
                    label={translate('vehicle.form.is_hybrid')}
                    size={'small'}
                    options={[
                      { label: 'Yes', value: true },
                      { label: 'No', value: false }
                    ]}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value}
                  />
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{p: 3}}>
                <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                  {translate('vehicle.form.characteristics')}
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

                  <RHFTextField
                    name="characteristics.year"
                    label={translate('vehicle.form.year')}
                    size={'small'}
                  />
                  <RHFTextField
                    name="characteristics.color"
                    label={translate('vehicle.form.color')}
                    size={'small'}
                  />
                  <RHFTextField
                    name="characteristics.lot_id"
                    label={translate('vehicle.form.lot_id')}
                    size={'small'}
                  />
                  <RHFTextField
                    name="characteristics.buyer_id"
                    label={translate('vehicle.form.buyer_id')}
                    size={'small'}
                  />

                </Box>
              </Card>
              <Card sx={{p: 3, mt: 2}}>
                <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                  {translate('vehicle.form.title')}
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
                  <RHFAutocomplete
                    name="title.is_title"
                    label={translate('vehicle.form.is_title')}
                    size={'small'}
                    options={[
                      { label: 'Yes', value: true },
                      { label: 'No', value: false }
                    ]}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value}
                  />
                  <RHFAutocomplete
                    name="title.title_type"
                    label={translate('vehicle.form.title_type')}
                    size={'small'}
                    options={formData?.title_type?.map?.((item) => ({
                      label: item[1],
                      value: item[0]
                    })) || []}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value}
                  />
                  <RHFTextField
                    name="title.title_received_date"
                    label={translate('vehicle.form.title_received_date')}
                    type="date"
                    size={'small'}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <RHFTextField
                    name="title.title_no"
                    label={translate('vehicle.form.title_no')}
                    size={'small'}
                  />
                  <RHFTextField
                    name="title.title_state"
                    label={translate('vehicle.form.title_state')}
                    size={'small'}
                  />
                  <RHFTextField
                    name="title.title_amount"
                    label={translate('vehicle.form.title_amount')}
                    type="number"
                    size={'small'}
                  />
                </Box>
              </Card>
              <Card sx={{p: 3, mt: 2}}>
                <DeliveryHistory formData={formData}/>
              </Card>
              <Card sx={{p: 3, mt: 2}}>
                <Documents formData={formData}/>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{p: 3, mt: 2}}>
                <VehiclePhoto formData={formData}/>
              </Card>
            </Grid>
          </Grid>
          <Card sx={{p: 3, mt: 3}}>
            <Stack alignItems="flex-end" sx={{}}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('vehicle.form.create_button') : translate('vehicle.form.edit_button')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>


    </FormProvider>
  )
}
