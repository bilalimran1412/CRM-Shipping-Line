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
      label: translate('my-vehicle-task.table.task_type'),
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
