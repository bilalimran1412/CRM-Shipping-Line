import {Link, Stack, Typography} from "@mui/material";
import {CustomAvatar} from "components/custom-avatar";
import {actionCellRenderer} from "components/datatable/utils";
import {permissions, ROUTE_URL} from "../config";
import {Link as RouterLink} from 'react-router-dom'

export const getCols = ({translate, onClickAvatar, onDelete, checkPermission}) => {
  return [
    {
      id: 'checkbox',
      label: '',
      align: 'left',
      checkbox: true,
      pin: 'left',
    },
    {
      id: 'first_name',
      label: translate('user.table.user'),
      align: 'left',
      width: '200px',
      render: row => {
        // row.first_name
        return (
          <Stack direction="row" alignItems="center" spacing={2}>
            <CustomAvatar
              src={row?.avatar?.thumb}
              alt={row?.first_name}
              name={row?.first_name}
              sx={{
                width: 30,
                height: 30,
              }}
              className={row?.avatar && 'cursor-pointer'}
              onClick={() => onClickAvatar(row)}
            />
            <Link component={RouterLink} to={`/${ROUTE_URL}/view/${row.id}`} underline="none">
              <Typography variant="subtitle2" noWrap>
                {row.first_name} {row.last_name}
              </Typography>
            </Link>
          </Stack>
        )
      },
      sort: true,
      pin: 'left',
    },
    {
      id: 'last_name',
      label: translate('user.last_name'),
      align: 'left',
      width: '200px',
      render: row => row.last_name,
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