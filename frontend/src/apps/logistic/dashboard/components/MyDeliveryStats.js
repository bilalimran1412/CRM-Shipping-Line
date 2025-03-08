import {Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import Scrollbar from "../../../../components/scrollbar/Scrollbar";
import {useSettingsContext} from "../../../../components/settings";
import {useLocales} from "../../../../locales";

const MyDeliveryStats = ({data}) => {
  const {themeStretch, themeMode} = useSettingsContext()
  const {translate, currentLang} = useLocales()
  return (
    <Card sx={{px: 3, py: 3, height: '100%'}}>
      <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
        {translate('logistic-dashboard.my_delivery_stats')}
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
                <TableCell>{translate('logistic-dashboard.status')}</TableCell>
                <TableCell>{translate('logistic-dashboard.count')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={themeMode === 'dark' ? 'dark' : 'light'}>
              <TableRow>
                <TableCell>{translate('logistic-dashboard.not_delivered')}</TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{color: `error.main`}}>
                    {data.not_delivered} {translate('logistic-dashboard.pcs')}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{translate('logistic-dashboard.delivered')}</TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{color: `success.main`}}>
                    {data.delivered} {translate('logistic-dashboard.pcs')}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{translate('logistic-dashboard.total')}</TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{color: `info.main`}}>
                    {data.total} {translate('logistic-dashboard.pcs')}
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

export default MyDeliveryStats
