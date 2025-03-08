import {Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import Scrollbar from "../../../../components/scrollbar/Scrollbar";
import {useSettingsContext} from "../../../../components/settings";
import {useLocales} from "../../../../locales";

const StatByStatus = ({data}) => {
  const {themeStretch, themeMode} = useSettingsContext()
  const {translate, currentLang} = useLocales()

  return (
    <Card sx={{
      px: 3, 
      py: 3, 
      height: 500,
      boxShadow: (theme) => theme.customShadows.card,
      '& .recharts-wrapper': {
        margin: 'auto',
      },
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Typography 
        variant="h6" 
        sx={{
          color: 'text.primary',
          mb: 3,
          fontWeight: 600,
        }}
      >
        {translate('logistic-dashboard.stat_by_status')}
      </Typography>

      <TableContainer 
        sx={{
          flex: 1,
          overflow: 'hidden',
          '& .MuiTableCell-root': {
            px: 2,
            py: 1.5,
          },
          '& .MuiTableHead-root': {
            bgcolor: (theme) => theme.palette.background.neutral,
          },
          borderRadius: 1,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }} 
        className={'table-zebra-bordered'}
      >
        <Scrollbar sx={{ maxHeight: '100%' }}>
          <Table size={'small'}>
            <colgroup>
              <col width={'70%'}/>
              <col width={'30%'}/>
            </colgroup>
            <TableHead className={themeMode === 'dark' ? 'dark' : 'light'}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>{translate('logistic-dashboard.status')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{translate('logistic-dashboard.count')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={themeMode === 'dark' ? 'dark' : 'light'}>
              {(data.statuses.length === 0 && data.empty_status === 0) &&
                <TableRow>
                  <TableCell colspan={4}>
                    <Typography variant="subtitle1" className={'text-centered'}>
                      {translate('empty')}
                    </Typography>
                  </TableCell>
                </TableRow>
              }
              {data.statuses.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{item.name[currentLang.value]}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {item.vehicle_count} {translate('logistic-dashboard.pcs')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              })}
              {data.empty_status !== 0 &&

                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{color: `error.main`}}>
                      {translate('not_specified')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{color: `error.main`}}>
                      {data.empty_status} {translate('logistic-dashboard.pcs')}
                    </Typography>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  )
}

export default StatByStatus
