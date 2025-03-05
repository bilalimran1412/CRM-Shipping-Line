import {Stack, Typography} from "@mui/material";
import {CustomAvatar} from "components/custom-avatar";
import {actionCellRenderer} from "components/datatable/utils";
import {permissions, ROUTE_URL} from "../config";

export const getCols = ({translate, onDelete, checkPermission}) => {
  return [
    {
      id: 'id',
      label: 'ID',
      align: 'left',
      pin: 'left',
      width: '40px',
      render: row => row.id,
    },
    {
      id: 'title',
      label: translate('group.table.title'),
      align: 'left',
      width: '300px',
      render: row => row.title,
      sort: true,
    },
    {
      id: 'name',
      label: translate('group.table.name'),
      align: 'left',
      width: '200px',
      render: row => row.name,
      sort: true,
    },

    {
      id: 'actions',
      label: 'Действия',
      align: 'right',
      render: actionCellRenderer({ROUTE_URL, translate, onDelete, permissions, checkPermission})
    },
  ]
}