import {Link, Paper, Stack, Typography} from "@mui/material";
import {CustomAvatar} from "components/custom-avatar";
import {actionCellRenderer} from "components/datatable/utils";
import {permissions, ROUTE_URL} from "../config";
import {Link as RouterLink} from 'react-router-dom'
import Image from "../../../../components/image";

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
      id: 'name',
      label: translate('vehicle-task-type.table.name'),
      align: 'left',
      width: '300px',
      render: row => {
        // row.first_name
        return (
          <Typography variant="subtitle1">
            {row.name?.[currentLang.value]}
          </Typography>
        )
      },
      sort: true,
      pin: 'left',
    },
    {
      id: 'icon',
      label: translate('vehicle-task-type.table.icon'),
      align: 'left',
      width: '300px',
      render: row => {
        if(!row.icon) return null
        return (
          <Image
            disabledEffect
            alt={row.name?.[currentLang.value]}
            src={row.icon?.file}
            sx={{ height: 30 }}
            objectFit={'unset'}
            width={null}
          />
        )
      },
      sort: true,
      pin: 'left',
    },

    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: actionCellRenderer({ROUTE_URL, translate, onDelete, permissions, checkPermission})
    },
  ]
}