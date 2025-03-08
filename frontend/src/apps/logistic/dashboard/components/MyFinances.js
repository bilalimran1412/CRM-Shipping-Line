import {Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import Scrollbar from "../../../../components/scrollbar/Scrollbar";
import {useSettingsContext} from "../../../../components/settings";
import {useLocales} from "../../../../locales";

const MyFinances = ({data, currency}) => {
  const {themeStretch, themeMode} = useSettingsContext()
  const {translate, currentLang} = useLocales()
  return (
    <Card sx={{px: 3, py: 3, height: '100%'}}>
      <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
        {translate('logistic-dashboard.my_finances')}
      </Typography>
      <TableContainer sx={{overflow: 'unset'}} className={'table-zebra-bordered'}>
        <Scrollbar>
          <Table size={'small'}>
            <colgroup>
              <col width={'70%'}/>
              <col width={'30%'}/>
            </colgroup>
            <TableHead className={themeMode === 'dark' ? 'dark' : 'light'}>
              <TableRow>
                <TableCell>{translate('logistic-dashboard.name')}</TableCell>
                <TableCell>{translate('logistic-dashboard.amount')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={themeMode === 'dark' ? 'dark' : 'light'}>
              <TableRow>
                <TableCell>{translate('logistic-dashboard.total_amount')}</TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{color: `warning.main`}}>
                    {data?.total_unpaid_invoice_amount || 0} {currency.code}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{translate('logistic-dashboard.paid')}</TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{color: `info.main`}}>
                    {data?.total_paid_invoice_amount || 0} {currency.code}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{translate('logistic-dashboard.balance')}</TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{color: `error.main`}}>
                    {data?.balance || 0} {currency.code}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  )
}

export default MyFinances
