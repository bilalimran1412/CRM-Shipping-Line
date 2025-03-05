import {
  Card,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  TableRow as MUITableRow
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

const VehicleList = forwardRef(({}, ref) => {
  const {control, setValue, watch, resetField} = useFormContext();

  const {fields: data, append, remove} = useFieldArray({
    control,
    name: 'vehicles',
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
  const onDelete = (id) => {
    const fieldIndex = data.findIndex(item => item.vehicle.id === id)
    remove(fieldIndex)
  }
  const tableCols = vehicleCols({translate, onDelete, currentLang, checkPermission})
  return (
    <Grid container spacing={3} sx={{mt: 1}}>
      <Grid item xs={12} md={12}>
        <Card sx={{p: 3, height: '100%'}}>
          <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
            {translate('shipment.form.vehicle_list')}
          </Typography>
          <TableContainer className={'relative-block'}>
            <Scrollbar>
              <Table size={'small'} sx={{minWidth: 800}} className={'datatable'}>
                <TableHeadCustom
                  headLabel={tableCols}
                  rowCount={data?.length}
                />
                <TableBody className={themeMode === 'dark' ? 'dark' : 'light'}>
                  {data.map((row) => (
                    <TableRow
                      cols={tableCols}
                      key={row._field_id}
                      row={row}
                    />
                  ))}

                  {isNotFound &&
                    <MUITableRow>
                      <TableCell colSpan={12}>
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            height: 1,
                            textAlign: 'center',
                            p: (theme) => theme.spacing(2, 2),
                          }}
                        >
                          <Typography variant="h5" gutterBottom>
                            {translate("no_data")}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </MUITableRow>
                  }
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  )
})

export default VehicleList