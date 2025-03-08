import {
    Card,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Typography,
    TableRow as MUITableRow, Link, Tooltip, IconButton, Button, Box
  } from "@mui/material";
  import {TableHeadCustom, TableNoData} from "components/table";
  import Scrollbar from "components/scrollbar/Scrollbar";
  import TableRow from "components/datatable/TableRow";
  import {useLocales} from "locales";
  import {useSettingsContext} from "components/settings";
  import {forwardRef, useImperativeHandle, useState} from "react";
  import {useAuthContext} from "auth/useAuthContext";
  import {vehicleCols} from "../../customer-invoice-detail-template/utils";
  import {useFieldArray, useFormContext} from "react-hook-form";
  import {RHFTextField} from "../../../../components/hook-form";
  import '../assets/style.scss'
  import {Link as RouterLink} from "react-router-dom";
  import Iconify from "../../../../components/iconify";
  import CurrencyField from "../../../../components/custom-form/CurrencyField";
  import TemplateButton from "./TemplateButton";
  const VehicleList = forwardRef(({formData}, ref) => {
    const {control, setValue, watch, resetField} = useFormContext();
  
    const {fields: data, append, remove, replace} = useFieldArray({
      control,
      name: 'items',
      keyName: '_field_id',
    });
    useImperativeHandle(ref, () => {
      return {
        append(data) {
          append(data)
        },
        remove(data) {
          remove(data)
        },
      };
    }, []);
    const {translate, currentLang} = useLocales()
    const {checkPermission} = useAuthContext()
    const {themeMode} = useSettingsContext()
    const isNotFound = data?.length === 0
  
    return (
      <Grid container spacing={3} sx={{mt: 1}}>
        <Grid item xs={12} md={12}>
          <Card sx={{p: 3, height: '100%'}}>
            <Stack direction="row" alignItems="center" sx={{mb: 2}}>
              <Box sx={{flexGrow: 1}}>
                <Typography variant="h6" sx={{color: 'text.disabled'}}>
                  {translate('customer-invoice.form.details')}
                </Typography>
              </Box>
              <Box>
                <Box sx={{flexShrink: 0}}>
                  <TemplateButton formData={formData} replace={replace}/>
                </Box>
              </Box>
            </Stack>
            <Scrollbar>
              {data.map((row, index) => {
                return (
                  <Grid container spacing={3} className={'invoice-vehicle-form'} sx={{pb: 2, mt: 0, pl: 1, pr: 1}} key={row._field_id}>
                    <Grid item xs={12} md={4}>
                      <RHFTextField
                        size="small"
                        name={`items.${index}.description`}
                        label={translate('customer-invoice.form.description')}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <CurrencyField
                        size={'small'}
                        name={`items.${index}`}
                        label={translate('customer-invoice.form.amount')}
                        currencies={formData?.currency}
                        rates={formData?.currency_rate}
                        primaryCurrency={formData?.primary_currency}
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <Tooltip title={translate('add')}>
                        <IconButton color="error" size={'small'} onClick={() => remove(index)}>
                          <Iconify icon="eva:trash-2-outline"/>
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
  
                )
              })}
              <Button
                startIcon={<Iconify icon="eva:plus-fill"/>}
                sx={{flexShrink: 0, mt: 2}}
                variant={'contained'}
                style={{width: '100%'}}
                onClick={() => append({
                  currency: formData?.primary_currency?.id,
                  exchange_rate: 1,
                  amount_in_currency: 0,
                  amount_in_default: 0,
                })}
              >
                {translate('add')}
              </Button>
            </Scrollbar>
          </Card>
        </Grid>
      </Grid>
    )
  })
  
  export default VehicleList
  