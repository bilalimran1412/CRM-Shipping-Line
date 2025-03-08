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

export const getCols = ({translate, onClickAvatar, onDelete, checkPermission, currentLang, context}) => {
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
      id: 'name',
      label: translate('customer-invoice.table.name'),
      align: 'left',
      width: '400px',
      render: row => row.name,
      sort: true,
    },
    {
      id: 'status',
      label: translate('customer-invoice.table.finance.status'),
      align: 'left',
      width: '250px',
      render: row => {
        let statusColor = 'warning'
        if (row.status === 'paid') {
          statusColor = 'success'
        }
        return (
          <Typography variant="subtitle1" sx={{color: `${statusColor}.main`}}>
            {translate(`customer-invoice.table.finance.${row.status}`)}
          </Typography>
        )
      },
    },
    {
      id: 'amount',
      label: translate('customer-invoice.table.finance.title'),
      align: 'left',
      width: '250px',
      render: row => {
        return (
          <>
            <Typography variant="subtitle1" sx={{color: `info.main`}}>
              {translate('customer-invoice.table.finance.amount')}: {numberSeparatorValue(row.total_amount_in_default)} {row.currency.code}
            </Typography>
            {row.status === 'partially_paid' &&
              <>
                <Typography variant="subtitle1" sx={{color: `success.main`}}>
                  {translate('customer-invoice.table.finance.paid')}: {numberSeparatorValue(row.paid_in_default)} {row.currency.code}
                </Typography>
                <Typography variant="subtitle1" sx={{color: `error.main`}}>
                  {translate('customer-invoice.table.finance.balance')}: {numberSeparatorValue(row.balance)} {row.currency.code}
                </Typography>
              </>
            }
          </>
        )
      },
    },
    {
      id: 'datetime',
      label: translate('customer-invoice.table.datetime'),
      align: 'left',
      width: '250px',
      render: row => {
        // row.first_name
        return (
          <Typography variant="subtitle1">
            {moment(new Date(row.datetime)).format('DD/MM/YYYY HH:mm')}
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
      render: actionCellRenderer({ROUTE_URL, translate, onDelete, permissions: {}, checkPermission, customActions})
    },
  ]
}
