import {Link, Paper, Stack, Typography} from "@mui/material";
import {CustomAvatar} from "components/custom-avatar";
import {actionCellRenderer} from "components/datatable/utils";
import {permissions, ROUTE_URL} from "../config";
import {Link as RouterLink} from 'react-router-dom'
import Image from "../../../../components/image";

export const getCols = ({translate, currentLang, onDelete, checkPermission}) => {
  const userCanViewAllVehicles = checkPermission('logistic.view_all_customer_vehicles')
  const cols = [
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
      id: 'make',
      label: translate('vehicle.table.make'),
      align: 'left',
      width: '300px',
      render: row => {
        // row.first_name
        const characteristics = [row.characteristics.color, row.characteristics.year]
        return (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link component={RouterLink} to={`/${ROUTE_URL}/view/${row.id}`} underline="none">
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
      sort: true,
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
          <Stack direction="row" sx={{alignItems: 'center'}} spacing={1}>
            {row.destination?.icon &&
              <Image
                disabledEffect
                src={row.destination?.icon?.file}
                sx={{height: 30}}
                objectFit={'unset'}
                width={null}
              />
            }
            {row.destination ?
              <Typography variant="subtitle1" sx={{color: `info.main`}}>
                {row.destination.country?.[currentLang.value]}, {row.destination.city?.[currentLang.value]}
              </Typography>
              : translate('not_specified')
            }
          </Stack>

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
      id: 'status',
      label: translate('vehicle.table.status'),
      align: 'left',
      width: '300px',
      render: row => {
        return (
          <Stack direction="row" sx={{alignItems: 'center'}} spacing={1}>
            {row.status?.status?.icon &&
              <Image
                disabledEffect
                src={row.status?.status?.icon?.file}
                sx={{height: 30}}
                objectFit={'unset'}
                width={null}
              />
            }
            <Typography variant="subtitle1"
                        sx={{color: row.status ? `warning.main` : `error.main`}}>
              {row.status?.status.name[currentLang.value] ?? translate('not_specified')}
            </Typography>
          </Stack>

        )
      },
    },


    {
      id: 'actions',
      label: 'Действия',
      align: 'right',
      render: actionCellRenderer({ROUTE_URL, translate, onDelete, permissions, checkPermission})
    },
  ]
  if (!userCanViewAllVehicles){
    return cols.filter(item => item.id !== 'customer')
  }
  return cols
}