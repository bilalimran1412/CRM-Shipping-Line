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
import {actionCellRenderer} from "components/datatable/utils";
import {permissions, ROUTE_URL} from "../config";
import {Link as RouterLink} from 'react-router-dom'
import Iconify from "../../../../components/iconify";
import Scrollbar from "../../../../components/scrollbar/Scrollbar";
import {TableHeadCustom} from "../../../../components/table";
import TableRow from "../../../../components/datatable/TableRow";
import Image from "../../../../components/image";
import moment from "moment/moment";
import DownloadAction from "../components/DownloadAction";
import {fNumber, numberSeparatorValue} from "../../../../utils/formatNumber";

export const getCols = ({translate, onClickAvatar, onDelete, onDownload, checkPermission, currentLang, context}) => {
  const findTemplate = code => {
    return context?.templates?.find(item => item.value === code)?.name
  }
  const customActions = (row) => (
    <DownloadAction row={row}/>
  )
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
      id: 'type',
      label: translate('pricing.table.type'),
      align: 'left',
      render: row => row.type.name,
    },

    {
      id: 'date',
      label: translate('pricing.table.date'),
      align: 'left',
      width: '250px',
      render: row => {
        // row.first_name
        return (
          <Typography variant="subtitle1" sx={{color: `success.main`}}>
            {moment(new Date(row.date)).format('DD/MM/YYYY')}
          </Typography>
        )
      },
      sort: true,
      pin: 'left',
    },
    {
      id: 'actions',
      label: translate('actions'),
      align: 'right',
      render: actionCellRenderer({
        ROUTE_URL,
        translate,
        onDelete,
        permissions: {...permissions, view: ''},
        checkPermission,
        customActions
      })
    },
  ]
}
