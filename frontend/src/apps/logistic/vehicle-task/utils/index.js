import {Link, Paper, Stack, Typography} from "@mui/material";
import {CustomAvatar} from "components/custom-avatar";
import {actionCellRenderer} from "components/datatable/utils";
import {permissions, ROUTE_URL} from "../config";
import {Link as RouterLink} from 'react-router-dom'
import Image from "../../../../components/image";
import {ROUTE_URL as VEHICLE_ROUTE_URL} from '../../vehicle/config'
import moment from "moment";

export const getCols = ({translate, onClickAvatar, onDelete, checkPermission, currentLang, statuses}) => {
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
      width: '300px',
      render: row => {
        // row.first_name
        return (
          <Typography variant="subtitle1">
            {row.task_type?.name}
          </Typography>
        )
      },
      sort: true,
      pin: 'left',
    },
    {
      id: 'vehicle',
      label: translate('vehicle-task.table.vehicle'),
      align: 'left',
      width: '300px',
      render: row => {
        // row.first_name
        const characteristics = [row.vehicle.characteristics.color, row.vehicle.characteristics.year]
        return (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link component={RouterLink} to={`/${VEHICLE_ROUTE_URL}/view/${row.vehicle.id}`} target={'_blank'}
                  underline="none">
              <Typography variant="subtitle2" noWrap>
                {row.vehicle.manufacturer} {row.vehicle.model}
              </Typography>
              <Typography variant="subtitle2" noWrap sx={{color: `warning.main`}}>
                {characteristics.join(', ')}
              </Typography>
              <Typography variant="subtitle2" noWrap sx={{color: `info.main`}}>
                {row.vehicle.vin}
              </Typography>
            </Link>
          </Stack>
        )
      },
      sort: true,
      pin: 'left',
    },

    {
      id: 'note',
      label: translate('vehicle-task.table.note'),
      align: 'left',
      width: '300px',
      render: row => (
        <Typography variant="subtitle2" sx={{color: `success.main`}}>
          {row.note}
        </Typography>
      ),
      sort: true,
      pin: 'left',
    },
    {
      id: 'status',
      label: translate('vehicle-task.table.status'),
      align: 'left',
      width: '300px',
      render: row => (
        <Typography variant="subtitle2" sx={{color: `warning.main`}}>
          {statuses?.find?.(item => item.value === row.status)?.label?.[currentLang.value] || row.status}
        </Typography>
      ),
      sort: true,
      pin: 'left',
    },
    {
      id: 'created_at',
      label: translate('vehicle-task.table.created_at'),
      align: 'left',
      // width: '300px',
      render: row => (
        <Typography variant="subtitle2" sx={{color: `info.main`}}>
          {moment(new Date(row.created_at)).format('DD/MM/YYYY HH:mm')}
        </Typography>
      ),
      sort: true,
      pin: 'left',
    },

    {
      id: 'actions',
      label: translate('actions'),
      align: 'right',
      render: actionCellRenderer({ROUTE_URL, translate, onDelete, permissions, checkPermission})
    },
  ]
}
