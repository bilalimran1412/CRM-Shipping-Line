import {
  IconButton,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Tooltip,
  Typography,
  TableRow as MUITableRow
} from "@mui/material";
import {CustomAvatar} from "components/custom-avatar";
import {actionCellRenderer} from "components/datatable/utils";
import {permissions, ROUTE_URL} from "../config";
import {Link as RouterLink} from 'react-router-dom'
import Image from "../../../../components/image";
import moment from "moment/moment";
import Iconify from "../../../../components/iconify";
import Scrollbar from "../../../../components/scrollbar/Scrollbar";
import {TableHeadCustom} from "../../../../components/table";
import TableRow from "../../../../components/datatable/TableRow";

export const getCols = ({translate, onClickAvatar, onDelete, checkPermission, currentLang}) => {
  return [
    // {
    //   id: 'checkbox',
    //   label: '',
    //   align: 'left',
    //   checkbox: true,
    //   pin: 'left',
    // },
    
    {
      id: 'id',
      label: 'ID',
      align: 'left',
      width: '50px',
      render: row => row.id,
    },
    {
      id: 'task_type',
      label: translate('vehicle-task.table.task_type'),
      align: 'left',
      width: '100px',
      render: row => {
        // row.first_name
        return (
          <Typography variant="subtitle1">
            {row.name}
          </Typography>
        )
      },
      sort: true,
      pin: 'left',
    },
    {
      id: 'vehicle',
      label: 'vehicle',
      align: 'left',
      width: '300px',
      render: row => {
        // row.first_name
        return (
          <Typography variant="subtitle1">
            {row.vehicle}
          </Typography>
        )
      },
      sort: true,
      pin: 'left',
    },
    {
      id: 'note',
      label: 'note',
      align: 'left',
      width: '300px',
      render: row => {
        // row.first_name
        return (
          <Typography variant="subtitle1">
            {row.note}
          </Typography>
        )
      },
      sort: true,
      pin: 'left',
    },
    {
      id: 'status',
      label: 'status',
      align: 'left',
      width: '300px',
      render: row => {
        // row.first_name
        return (
          <Typography variant="subtitle1">
            {row.status}
          </Typography>
        )
      },
      sort: true,
      pin: 'left',
    },  
    {
      id: 'datetime',
      label: `Created`,
      align: 'left',
            width: '250px',
            render: row => {
              // row.first_name
              return (
                <Typography variant="subtitle1">
                  {moment(new Date(row.datetime)).format('YYYY-MM-DD HH:mm')}
                </Typography>
              )
            },
      sort: true,
      pin: 'left',
    },
    {
      id: 'actions',
      label: 'actions',
      align: 'right',
      render: actionCellRenderer({ROUTE_URL, translate, onDelete, permissions, checkPermission})
    },
  ]
}

export const vehicleSearchCols = ({translate, currentLang, onAppend, checkPermission}) => {
  return [
    {
      id: 'make',
      label: translate('vehicle.table.make'),
      align: 'left',
      width: '300px',
      render: row => {
        // row.first_name
        const characteristics = [row.characteristics.color, row.characteristics.year]
        return (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link component={RouterLink} to={`/logistic/vehicle/view/${row.id}`} target={'_blank'} underline="none">
              <Typography variant="subtitle1" noWrap>
                {row.manufacturer} {row.model}
              </Typography>
              <Typography variant="subtitle2" noWrap sx={{color: `warning.main`}}>
                {characteristics.join(', ')}
              </Typography>
            </Link>
          </Stack>
        )
      },
      pin: 'left',
    },
    {
      id: 'vin',
      label: translate('vehicle.table.vin'),
      align: 'left',
      width: '100px',
      render: row => {
        return (
          <Typography variant="subtitle1" sx={{color: `success.main`}}>
            {row.vin}
          </Typography>
        )
      },
    },
    {
      id: 'destination',
      label: translate('vehicle.table.destination'),
      align: 'left',
      width: '300px',
      render: row => {
        if (!row.destination) {
          return (
            <Typography variant="subtitle1" sx={{color: `error.main`}}>
              {translate('not_specified')}
            </Typography>
          )
        }
        return (
          <Typography variant="subtitle1" sx={{color: `info.main`}}>
            {row.destination.country?.[currentLang.value]}, {row.destination.city?.[currentLang.value]}
          </Typography>
        )
      },
    },
    {
      id: 'customer',
      label: translate('vehicle.table.customer'),
      align: 'left',
      width: '200px',
      render: row => {
        return (
          <Typography variant="subtitle1"
                      sx={{color: row.customer ? `primary.main` : `error.main`}}>
            {row.customer?.full_name ?? translate('not_specified')}
          </Typography>
        )
      },
    },


    {
      id: 'actions',
      label: 'Действия',
      align: 'right',
      render: row => {
        return (
          <Tooltip title={translate('add')}>
            <IconButton color="primary" size={'small'} onClick={() => onAppend(row)}>
              <Iconify icon="gravity-ui:plus"/>
            </IconButton>
          </Tooltip>
        )
      }
    },
  ]
}

export const vehicleCols = ({translate, currentLang, onDelete, checkPermission, disableActions}) => {
  const cols = [
    {
      id: 'make',
      label: translate('vehicle.table.make'),
      align: 'left',
      width: '300px',
      render: row => {
        // row.first_name
        const characteristics = [row.vehicle.characteristics.color, row.vehicle.characteristics.year]
        return (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link component={RouterLink} to={`/logistic/vehicle/view/${row.vehicle.id}`} target={'_blank'}
                  underline="none">
              <Typography variant="subtitle1" noWrap>
                {row.vehicle.manufacturer} {row.vehicle.model}
              </Typography>
              <Typography variant="subtitle2" noWrap sx={{color: `warning.main`}}>
                {characteristics.join(', ')}
              </Typography>
            </Link>
          </Stack>
        )
      },
      pin: 'left',
    },
    {
      id: 'vin',
      label: translate('vehicle.table.vin'),
      align: 'left',
      width: '100px',
      render: row => {
        return (
          <Typography variant="subtitle1" sx={{color: `success.main`}}>
            {row.vehicle.vin}
          </Typography>
        )
      },
    },
    {
      id: 'destination',
      label: translate('vehicle.table.destination'),
      align: 'left',
      width: '300px',
      render: row => {
        if (!row.vehicle.destination) {
          return (
            <Typography variant="subtitle1" sx={{color: `error.main`}}>
              {translate('not_specified')}
            </Typography>
          )
        }
        return (
          <Typography variant="subtitle1" sx={{color: `info.main`}}>
            {row.vehicle.destination.country?.[currentLang.value]}, {row.vehicle.destination.city?.[currentLang.value]}
          </Typography>
        )
      },
    },
    {
      id: 'customer',
      label: translate('vehicle.table.customer'),
      align: 'left',
      width: '200px',
      render: row => {
        return (
          <Typography variant="subtitle1"
                      sx={{color: row.vehicle.customer ? `primary.main` : `error.main`}}>
            {row.vehicle.customer?.full_name ?? translate('not_specified')}
          </Typography>
        )
      },
    },

  ]
  if (!disableActions) {
    cols.push({
      id: 'actions',
      label: 'actions',
      align: 'right',
      render: row => {
        return (
          <Tooltip title={translate('add')}>
            <IconButton color="error" size={'small'} onClick={() => onDelete(row.vehicle.id)}>
              <Iconify icon="eva:trash-2-outline"/>
            </IconButton>
          </Tooltip>
        )
      }
    })
  }
  return cols
}

export const renderCollapse = ({data, tableCols, themeMode, translate}) => {
  const isNotFound = data?.length === 0
  return (
    <Paper
      variant="outlined"
      sx={{
        my: 2,
        py: 1,
        borderRadius: 1.5,
      }}
    >
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
                  key={row.id}
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
    </Paper>
  )
}