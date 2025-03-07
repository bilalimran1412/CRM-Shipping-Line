import {useCallback, useEffect, useRef, useState} from 'react'
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
import {validator} from "../validators";
import RHFDateTimeField from "components/hook-form/RHFDateTimeField";
import useApi from "hooks/useApi";
import {store} from "../index";
import {useParams} from "react-router-dom";
import {useSettingsContext} from "components/settings";
import CurrencyField from "../../../../components/custom-form/CurrencyField";
import RHFDateField from "../../../../components/hook-form/RHFDateField";
import {fDate} from "../../../../utils/formatTime";
import RHFFileUploadField from "../../../../components/hook-form/RHFFileUploadField";
// ----------------------------------------------------------------------


export default function EditForm({isEdit = false, data, formData, onSubmit, isSubmitting}) {
  const {translate, currentLang} = useLocales()
  const {themeMode} = useSettingsContext()
  const {customDetailPostRequest} = useApi(store)
  const {id} = useParams()
  const searchRef = useRef()
  const initLoadRef = useRef(true); // To track the first load
  const vehicleListRef = useRef()
  const methods = useForm({
    resolver: yupResolver(validator(translate)),
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
  }, [isEdit, data])


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{p: 3, height: '100%'}}>
                <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                  {translate('pricing.form.main_data')}
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
                    name="type"
                    label={translate('pricing.form.type')}
                    size={'small'}
                    options={formData?.type?.map?.((item) => {
                      return {
                        label: item.name,
                        value: item.id,
                      }
                    })}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                  />
                  <RHFDateField
                    size={'small'}
                    name={`date`}
                    label={translate('pricing.form.date')}
                    onChange={value => setValue('date', fDate(value, 'DD/MM/YYYY'))}
                  />
                  <RHFFileUploadField
                    name="file"
                    size={'small'}
                    type="pricing"
                    label={translate('pricing.form.file')}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{p: 3, mt: 3}}>
            <Stack alignItems="flex-end">
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('pricing.form.create_button') : translate('pricing.form.edit_button')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

    </FormProvider>
  )
}