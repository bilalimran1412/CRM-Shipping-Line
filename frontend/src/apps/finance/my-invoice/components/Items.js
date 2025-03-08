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
  import {vehicleCols} from "../utils";
  import {useFieldArray, useFormContext} from "react-hook-form";
  import {RHFTextField} from "../../../../components/hook-form";
  import '../assets/style.scss'
  import {Link as RouterLink} from "react-router-dom";
  import Iconify from "../../../../components/iconify";
import { id } from "date-fns/locale";
  
  const VehicleList = forwardRef(({formData}, ref) => {
    const {control, setValue, watch, resetField} = useFormContext();
  
    const {fields, append, remove} = useFieldArray({
      control,
      name: 'items',
      keyName: '_field_id',
    });
    const {translate, currentLang} = useLocales()
    const {checkPermission} = useAuthContext()
    const {themeMode} = useSettingsContext()
    const handleAdd = () => {
      append({});
    };
    const handleRemove = (index) => {
      remove(index)
    }
    return (
      <Grid container spacing={3} sx={{mt: 1}}>
        <Grid item xs={12} md={12}>
          <Card sx={{p: 3, height: '100%'}}>
            <Typography variant="h6" sx={{color: 'text.disabled'}}>
              {translate('customer-invoice-detail-template.form.details')}
            </Typography>
  
  
            <Scrollbar>
              {fields.map((item, index) => {
                return (
                  <Grid key={item._field_id} container spacing={3} className={'customer-invoice-detail-template-form'} sx={{pb: 2, mt: 0, pl: 1, pr: 1}}>
                    <Grid item xs={12} md={11}>
                      <RHFTextField
                        size="small"
                        name={`items.${index}.description`}
                        label={translate('customer-invoice-detail-template.form.description')}
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <IconButton color="error" size={'small'} onClick={() => handleRemove(index)}>
                          <Iconify icon="eva:trash-2-outline"/>
                        </IconButton>
                    </Grid>
                  </Grid>
  
                )
              })}
              <Button
                startIcon={<Iconify icon="eva:plus-fill"/>}
                sx={{flexShrink: 0, mt: 2}}
                variant={'contained'}
                style={{width: '100%'}}
                onClick={() => handleAdd()}
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
  