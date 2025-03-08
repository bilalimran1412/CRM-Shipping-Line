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
import Items from "./Items.js";
import CurrencyField from "../../../../components/custom-form/CurrencyField";
// ----------------------------------------------------------------------


export default function Form({isEdit = false, data, formData, onSubmit, isSubmitting}) {
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
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{p: 3, height: '100%'}}>
                <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                  {translate('customer-invoice-detail-template.form.main_data')}
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
                    label={translate('customer-invoice-detail-template.form.name')}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Items ref={vehicleListRef} formData={formData}/>
            </Grid>
          </Grid>

          <Card sx={{p: 3, mt: 3}}>
            <Stack alignItems="flex-end">
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('customer-invoice-detail-template.form.create_button') : translate('customer-invoice-detail-template.form.edit_button')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

    </FormProvider>
  )
}
