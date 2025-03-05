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
      label: translate('vehicle-photo-category.table.name'),
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
      id: 'actions',
      label: 'Действия',
      align: 'right',
      render: actionCellRenderer({ROUTE_URL, translate, onDelete, permissions, checkPermission})
    },
  ]
}