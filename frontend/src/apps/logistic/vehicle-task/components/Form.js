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
  Stack, Table, TableBody, TableCell, TableContainer, TableRow,
  Typography,
} from '@mui/material'
// components
import FormProvider, {RHFAutocomplete, RHFTextField} from 'components/hook-form'
import {useLocales} from "locales";
import validator from "../validators";
import RHFFileUploadField from "components/hook-form/RHFFileUploadField";
import Scrollbar from "../../../../components/scrollbar/Scrollbar";
import {useSettingsContext} from "../../../../components/settings";
// ----------------------------------------------------------------------


export default function Form({isEdit = false, data, formData, onSubmit, isSubmitting}) {
  const {translate, allLangs, currentLang} = useLocales()
  const {themeStretch, themeMode} = useSettingsContext()
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
                  {translate('vehicle-task.form.main_data')}
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
                  {formData?.data &&
                    <TableContainer sx={{overflow: 'unset'}} className={'table-zebra-bordered'}>
                      <Scrollbar>
                        <Table size={'small'}>
                          <colgroup>
                            <col width={'40%'}/>
                            <col width={'60%'}/>
                          </colgroup>
                          <TableBody className={themeMode === 'dark' ? 'dark' : 'light'}>
                            <TableRow>
                              <TableCell>ID</TableCell>
                              <TableCell>
                                <Typography variant="subtitle2">
                                  {formData.data.vehicle.id}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>{translate('vehicle.form.manufacturer')}</TableCell>
                              <TableCell>
                                <Typography variant="subtitle2">
                                  {formData.data.vehicle.manufacturer}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>{translate('vehicle.form.model')}</TableCell>
                              <TableCell>
                                <Typography variant="subtitle2">
                                  {formData.data.vehicle.model}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>{translate('vehicle.form.vin')}</TableCell>
                              <TableCell>
                                <Typography variant="subtitle2">
                                  {formData.data.vehicle.vin}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>{translate('vehicle.form.customer')}</TableCell>
                              <TableCell>
                                <Typography variant="subtitle2"
                                            sx={formData.data.vehicle.customer?.full_name ? undefined : {color: `error.main`}}>
                                  {formData.data.vehicle.customer?.full_name ?? translate('not_specified')}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>{translate('vehicle.form.destination')}</TableCell>
                              <TableCell>
                                <Typography variant="subtitle2"
                                            sx={formData.data.vehicle.destination ? undefined : {color: `error.main`}}>
                                  {formData.data.vehicle.destination ?
                                    `${formData.data.vehicle.destination.country?.[currentLang.value]}, ${formData.data.vehicle.destination.city?.[currentLang.value]}`
                                    : translate('not_specified')
                                  }

                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>{translate('vehicle.table.status')}</TableCell>
                              <TableCell>
                                <Typography variant="subtitle2"
                                            sx={formData.data.vehicle.status ? undefined : {color: `error.main`}}>
                                  {formData.data.vehicle.status?.status?.name?.[currentLang.value] ?? translate('not_specified')}

                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Scrollbar>
                    </TableContainer>
                  }
                  <RHFAutocomplete
                    name="assigned_to"
                    label={translate('vehicle-task.form.assigned_to')}
                    options={formData?.employees?.map?.(({id, full_name}) => ({
                      label: full_name,
                      value: id,
                    }))}
                    size={'small'}
                    multiple
                    fullWidth
                    filterSelectedOptions
                  />
                  <RHFTextField
                    size={'small'}
                    name={`note`}
                    multiline
                    rows={4}
                    label={`${translate('vehicle-task.form.note')}`}
                  />

                  <RHFAutocomplete
                    size={'small'}
                    name="status"
                    label={translate('vehicle-task.filter.status')}
                    options={formData?.status?.map?.(({value, label}) => ({
                      label: label[currentLang.value],
                      value,
                    }))}
                    fullWidth
                    filterSelectedOptions
                  />
                </Box>
                <Stack alignItems="flex-start" sx={{mt: 3}}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? translate('vehicle-task.form.create_button') : translate('vehicle-task.form.edit_button')}
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
