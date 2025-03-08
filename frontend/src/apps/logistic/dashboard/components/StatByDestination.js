import {Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import Scrollbar from "../../../../components/scrollbar/Scrollbar";
import {useSettingsContext} from "../../../../components/settings";
import {useLocales} from "../../../../locales";
import Image from "../../../../components/image";

const StatByDestination = ({data}) => {

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
      <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
        {translate('logistic-dashboard.stat_by_destination')}
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
              <col width={'50%'}/>
              <col width={'13%'}/>
              <col width={'13%'}/>
              <col width={'14%'}/>
            </colgroup>
            <TableHead className={themeMode === 'dark' ? 'dark' : 'light'}>
              <TableRow>
                <TableCell>{translate('logistic-dashboard.destination')}</TableCell>
                <TableCell>{translate('logistic-dashboard.not_delivered')}</TableCell>
                <TableCell>{translate('logistic-dashboard.delivered')}</TableCell>
                <TableCell>{translate('logistic-dashboard.total')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={themeMode === 'dark' ? 'dark' : 'light'}>
              {(data.destinations.length === 0 && data.unassociated_vehicles.total === 0) &&
                <TableRow>
                  <TableCell colspan={4}>
                    <Typography variant="subtitle1" className={'text-centered'}>
                      {translate('empty')}
                    </Typography>
                  </TableCell>
                </TableRow>
              }
              {data.destinations.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell style={{display: 'flex', alignItems: 'center'}}>
                      <Image
                        disabledEffect
                        src={item.icon?.file}
                        sx={{height: 22, mr: 1}}
                        objectFit={'unset'}
                        width={null}
                      />
                      {item.country?.[currentLang.value]}, {item.city?.[currentLang.value]}
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{color: `error.main`}}>
                        {item.not_delivered} {translate('logistic-dashboard.pcs')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{color: `success.main`}}>
                        {item.delivered} {translate('logistic-dashboard.pcs')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{color: `info.main`}}>
                        {item.total} {translate('logistic-dashboard.pcs')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              })}
              {data.unassociated_vehicles.total !== 0 &&

                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{color: `error.main`}}>
                      {translate('not_specified')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{color: `error.main`}}>
                      {data.unassociated_vehicles.not_delivered} {translate('logistic-dashboard.pcs')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{color: `success.main`}}>
                      {data.unassociated_vehicles.delivered} {translate('logistic-dashboard.pcs')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{color: `info.main`}}>
                      {data.unassociated_vehicles.total} {translate('logistic-dashboard.pcs')}
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

export default StatByDestination
