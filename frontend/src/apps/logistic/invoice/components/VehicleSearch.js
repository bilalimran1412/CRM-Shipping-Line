import {Card, Grid, Stack, Table, TableBody, TableCell, TableContainer, Typography} from "@mui/material";
import {TableHeadCustom} from "components/table";
import Scrollbar from "components/scrollbar/Scrollbar";
import TableRow from "components/datatable/TableRow";
import {useLocales} from "locales";
import {useSettingsContext} from "components/settings";
import {forwardRef, useImperativeHandle, useState} from "react";
import {useAuthContext} from "auth/useAuthContext";
import {vehicleSearchCols} from "../utils";
import {useFormContext} from "react-hook-form";

const VehicleSearch = forwardRef(({onAppend}, ref) => {
  const [data, setData] = useState(null)
  const {control, setValue, watch, resetField} = useFormContext();
  useImperativeHandle(ref, () => {
    return {
      setData(data) {
        setData(data)
      },
    };
  }, []);
  const values = watch()
  const {translate, currentLang} = useLocales()
  const {checkPermission} = useAuthContext()
  const {themeMode} = useSettingsContext()
  if (!data) return null
  const filterData = () => {
    const vehicles = values?.vehicles
    if (vehicles) {
      const vehicleKeys = vehicles.map(({vehicle}) => vehicle.id)
      return data.filter(({id}) => !vehicleKeys.includes(id))
    }
    return data
  }
  const isNotFound = filterData()?.length === 0
  const tableCols = vehicleSearchCols({translate, onAppend, currentLang, checkPermission})
  return (
    <Grid container spacing={3} sx={{mt: 1}}>
      <Grid item xs={12} md={12}>
        <Card sx={{p: 3, height: '100%'}}>
          <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
            {translate('invoice.form.search.result')}
          </Typography>

          <TableContainer className={'relative-block'}>
            <Scrollbar>
              <Table size={'small'} sx={{minWidth: 800}} className={'datatable'}>
                <TableHeadCustom
                  headLabel={tableCols}
                  rowCount={filterData()?.length}
                />
                <TableBody className={themeMode === 'dark' ? 'dark' : 'light'}>
                  {filterData().map((row) => (
                    <TableRow
                      cols={tableCols}
                      key={row.id}
                      row={row}
                    />
                  ))}
                  <TableCell colSpan={12}>
                    {isNotFound &&
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
                    }
                  </TableCell>
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  )
})

export default VehicleSearch