// @mui
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  Container,
  CircularProgress,
  Grid,
  Card, Typography
} from '@mui/material';
// components
import Scrollbar from '../../../../components/scrollbar';
import {useSettingsContext} from "../../../../components/settings";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useLocales} from "../../../../locales";
import useApi from "../../../../hooks/useApi";
import {store} from "../index";
import {useSnackbar} from "components/snackbar";
import {useEffect, useMemo, useRef} from "react";
import {searchParamsFromJSON} from "../../../../utils";
import {LIST_NAVIGATION, ROUTE_URL} from "../config";
import Error from "components/error";
import {Helmet} from "react-helmet-async";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import {MAIN_NAVIGATION_ROOT} from "routes/paths";
import Form from "../components/Form";
import Iconify from "../../../../components/iconify";
import {CustomAvatar} from "../../../../components/custom-avatar";
import {LightboxSingleImage} from "../../../../components/lightbox";
import moment from "moment";


export default function View() {
  const {themeStretch, themeMode} = useSettingsContext()
  const {id} = useParams()
  const {translate, currentLang} = useLocales()

  const {formData, formError, fetchForm, isFormLoading, clearFormData} = useApi(store)

  const {enqueueSnackbar} = useSnackbar()
  const navigate = useNavigate()
  const avatarRef = useRef()
  useEffect(() => {
    fetchForm(id)
    return () => {
      clearFormData()
    }
  }, [])

  if (formError) {
    return (
      <Error code={formError?.status}/>
    )
  }
  if (isFormLoading || !formData) {
    return (
      <Container maxWidth={'md'} className='relative-block'>
        <div className='loading-block loading-block-height'>
          <CircularProgress color="primary"/>
        </div>
      </Container>
    )
  }
  const currentStatus = formData?.status?.find?.(item => item.value === formData.data.status)
  const detail = formData.data
  return (
    <>
      <Helmet>
        <title>{translate('vehicle-task.title.view')}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'} className='relative-block'>
        <CustomBreadcrumbs
          heading={translate('vehicle-task.title.view')}
          links={[
            {name: translate('breadcrumb.main'), href: MAIN_NAVIGATION_ROOT},
            {name: translate('vehicle-task.breadcrumb.main'), href: LIST_NAVIGATION},
            {name: translate('vehicle-task.breadcrumb.view')},
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{px: 3, py: 3}}>
              <TableContainer sx={{overflow: 'unset'}} className={'table-zebra-bordered'}>
                <Scrollbar>
                  <Table size={'small'}>
                    <colgroup>
                      <col width={'40%'}/>
                      <col width={'60%'}/>
                    </colgroup>
                    <TableBody className={themeMode === 'dark' ? 'dark' : 'light'}>
                      <TableRow>
                        <TableCell>{translate('vehicle.form.manufacturer')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {detail.vehicle.manufacturer}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle.form.model')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {detail.vehicle.model}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle.form.vin')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {detail.vehicle.vin}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle.form.customer')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2"
                                      sx={detail.vehicle.customer?.full_name ? undefined : {color: `error.main`}}>
                            {detail.vehicle.customer?.full_name ?? translate('not_specified')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle.form.destination')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2"
                                      sx={detail.vehicle.destination ? undefined : {color: `error.main`}}>
                            {detail.vehicle.destination ?
                              `${detail.vehicle.destination.country?.[currentLang.value]}, ${detail.vehicle.destination.city?.[currentLang.value]}`
                              : translate('not_specified')
                            }

                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle.table.status')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2"
                                      sx={detail.vehicle.status ? undefined : {color: `error.main`}}>
                            {detail.vehicle.status?.status?.name?.[currentLang.value] ?? translate('not_specified')}

                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
              <TableContainer sx={{overflow: 'unset', mt: 2}} className={'table-zebra-bordered'}>
                <Scrollbar>
                  <Table size={'small'}>
                    <colgroup>
                      <col width={'40%'}/>
                      <col width={'60%'}/>
                    </colgroup>
                    <TableBody className={themeMode === 'dark' ? 'dark' : 'light'}>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {detail.id}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle-task.table.task_type')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {detail.task_type.name[currentLang.value]}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle-task.table.status')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{color: `${currentStatus?.color}.main`}}>
                            {currentStatus?.label?.[currentLang.value] || detail.status}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle-task.table.note')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" sx={detail.note ? undefined : {color: `error.main`}}>
                            {detail.note ?? translate('not_specified')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle-task.table.created_at')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{color: `info.main`}}>
                            {moment(new Date(detail.created_at)).format('DD/MM/YYYY HH:mm')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>

      </Container>
    </>
  )
}
