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
import {editValidator} from "../validators";
import RHFDateTimeField from "components/hook-form/RHFDateTimeField";
import useApi from "hooks/useApi";
import {store} from "../index";
import {useParams} from "react-router-dom";
import {useSettingsContext} from "components/settings";
import Items from "./Items.js";
import CurrencyField from "../../../../components/custom-form/CurrencyField";
import Payments from "./Payments";
// ----------------------------------------------------------------------


export default function Form({isEdit = false, data, formData, onSubmit, isSubmitting}) {
  const {translate, currentLang} = useLocales()
  const {themeMode} = useSettingsContext()
  const {customDetailPostRequest} = useApi(store)
  const {id} = useParams()
  const searchRef = useRef()
  const initLoadRef = useRef(true); // To track the first load
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
  }, [isEdit, data])
  const templateValue = watch('template')
  const template = formData?.templates ? formData.templates.find(item => item.value === templateValue) : null
  useEffect(() => {
    if (template) {
      if(isEdit){
        if (initLoadRef.current) {
          // Skip setting the value on initial load
          initLoadRef.current = false;
        } else {
          // Set the value on subsequent changes
          setValue('data.header', template.initial.header);
          setValue('data.footer', template.initial.footer);
        }
      } else {
        setValue('data.header', template.initial.header);
        setValue('data.footer', template.initial.footer);
      }
    }
  }, [templateValue]);


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{p: 3, height: '100%'}}>
                <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                  {translate('customer-invoice.form.main_data')}
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
                    label={translate('customer-invoice.form.name')}
                  />

                  <RHFAutocomplete
                    name="customer"
                    label={translate('customer-invoice.form.customer')}
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
                  <RHFDateTimeField
                    size={'small'}
                    name={`datetime`}
                    label={translate('customer-invoice.form.datetime')}
                  />
                  <RHFAutocomplete
                    name="template"
                    label={translate('customer-invoice.form.template')}
                    size={'small'}
                    options={formData?.templates?.map?.((item) => {
                      return {
                        label: item.name[currentLang.value],
                        value: item.value,
                      }
                    })}
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                  />
                  {template?.fields &&
                    <>
                      {template.fields.map((item, index) => {
                        return (
                          <RHFTextField
                            key={index}
                            size="small"
                            name={`data.${item.name}`}
                            label={item.label[currentLang.value]}
                          />
                        )
                      })}

                    </>
                  }
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{p: 3, height: '100%'}}>
                <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                  {translate('customer-invoice.form.header_footer_data')}
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
                    label={translate('customer-invoice.form.header')}
                  />
                  <RHFTextField
                    multiline
                    rows={6}
                    size="small"
                    name={`data.footer`}
                    label={translate('customer-invoice.form.footer')}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
          <Items ref={vehicleListRef} formData={formData}/>
          <Payments formData={formData}/>
          <Card sx={{p: 3, mt: 3}}>
            <Stack alignItems="flex-end">
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('customer-invoice.form.create_button') : translate('customer-invoice.form.edit_button')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

    </FormProvider>
  )
}
