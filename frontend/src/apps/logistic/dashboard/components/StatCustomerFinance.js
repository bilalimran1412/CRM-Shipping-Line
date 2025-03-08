import {Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import Scrollbar from "../../../../components/scrollbar/Scrollbar";
import {useSettingsContext} from "../../../../components/settings";
import {useLocales} from "../../../../locales";

const StatCustomerFinance = ({data, currency}) => {
  const {themeStretch, themeMode} = useSettingsContext()
  const {translate, currentLang} = useLocales()
  return (
    <Card sx={{px: 3, py: 3, height: '100%'}}>
      <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
        {translate('logistic-dashboard.customer_finances')}
      </Typography>
      <TableContainer sx={{overflow: 'unset'}} className={'table-zebra-bordered'}>
        <Scrollbar>
          <Table size={'small'}>
            <colgroup>
              <col width={'60%'}/>
              <col width={'13%'}/>
              <col width={'13%'}/>
              <col width={'14%'}/>
            </colgroup>
            <TableHead className={themeMode === 'dark' ? 'dark' : 'light'}>
              <TableRow>
                <TableCell>{translate('logistic-dashboard.customer')}</TableCell>
                <TableCell>{translate('logistic-dashboard.total_amount')}</TableCell>
                <TableCell>{translate('logistic-dashboard.paid')}</TableCell>
                <TableCell>{translate('logistic-dashboard.balance')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={themeMode === 'dark' ? 'dark' : 'light'}>
              {data.length === 0 &&
                <TableRow>
                  <TableCell colspan={4}>
                    <Typography variant="subtitle1" className={'text-centered'}>
                      {translate('empty')}
                    </Typography>
                  </TableCell>
                </TableRow>
              }
              {data.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{item.full_name}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{color: `warning.main`}}>
                        {item.total_unpaid_invoice_amount} {currency.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{color: `info.main`}}>
                        {item.total_paid_invoice_amount} {currency.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{color: `error.main`}}>
                        {item.balance} {currency.code}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  )
}

export default StatCustomerFinance
