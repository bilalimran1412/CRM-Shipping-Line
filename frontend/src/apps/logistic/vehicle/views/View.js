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
  Card, Typography, Tabs, Tab
} from '@mui/material';
// components
import Scrollbar from '../../../../components/scrollbar';
import {useSettingsContext} from "../../../../components/settings";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useLocales} from "../../../../locales";
import useApi from "../../../../hooks/useApi";
import {store} from "../index";
import {useSnackbar} from "components/snackbar";
import {useEffect, useMemo, useRef, useState} from "react";
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
import Timeline from "../components/Timeline";
import PhotoView from "../components/PhotoView";
import DocumentView from "../components/DocumentView";


export default function View() {
  const {themeStretch, themeMode} = useSettingsContext()
  const {id} = useParams()
  const {translate, currentLang} = useLocales()

  const {fetchDetail, detail, detailError, clearDetailData, detailLoading} = useApi(store)

  const {enqueueSnackbar} = useSnackbar()
  const navigate = useNavigate()
  const avatarRef = useRef()
  useEffect(() => {
    fetchDetail(id)
    return () => {
      clearDetailData()
    }
  }, [])

  if (detailError) {
    return (
      <Error code={detailError?.status}/>
    )
  }
  if (detailLoading || !detail) {
    return (
      <Container maxWidth={'md'} className='relative-block'>
        <div className='loading-block loading-block-height'>
          <CircularProgress color="primary"/>
        </div>
      </Container>
    )
  }
  return (
    <>
      <Helmet>
        <title>{translate('vehicle.title.view')}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'} className='relative-block'>
        <CustomBreadcrumbs
          heading={translate('vehicle.title.view')}
          links={[
            {name: translate('breadcrumb.main'), href: MAIN_NAVIGATION_ROOT},
            {name: translate('vehicle.breadcrumb.main'), href: LIST_NAVIGATION},
            {name: translate('vehicle.breadcrumb.view')},
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{px: 3, py: 3, height: '100%'}}>
              <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
                {translate('vehicle.form.main_data')}
              </Typography>
              <TableContainer sx={{overflow: 'unset'}} className={'table-zebra-bordered'}>
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
                        <TableCell>{translate('vehicle.form.manufacturer')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {detail.manufacturer}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle.form.model')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {detail.model}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle.form.vin')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {detail.vin}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle.form.customer')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2"
                                      sx={detail.customer?.full_name ? undefined : {color: `error.main`}}>
                            {detail.customer?.full_name ?? translate('not_specified')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle.form.destination')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" sx={detail.destination ? undefined : {color: `error.main`}}>
                            {detail.destination ?
                              `${detail.destination.country?.[currentLang.value]}, ${detail.destination.city?.[currentLang.value]}`
                              : translate('not_specified')
                            }

                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle.table.status')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" sx={detail.status ? undefined : {color: `error.main`}}>
                            {detail.status?.status?.name?.[currentLang.value] ?? translate('not_specified')}

                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

              <Typography variant="h6" sx={{color: 'text.disabled', mb: 2, mt: 2}}>
                {translate('vehicle.form.characteristics')}
              </Typography>
              <TableContainer sx={{overflow: 'unset'}} className={'table-zebra-bordered'}>
                <Scrollbar>
                  <Table size={'small'}>
                    <colgroup>
                      <col width={'40%'}/>
                      <col width={'60%'}/>
                    </colgroup>
                    <TableBody className={themeMode === 'dark' ? 'dark' : 'light'}>
                      <TableRow>
                        <TableCell>{translate('vehicle.form.year')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {detail.characteristics?.year}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle.form.color')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {detail.characteristics?.color}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle.form.lot_id')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {detail.characteristics?.lot_id}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle.form.buyer_id')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {detail.characteristics?.buyer_id}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{px: 3, py: 3, height: '100%'}}>
              <Typography variant="h6" sx={{color: 'text.disabled', mb: 2, mt: 2}}>
                {translate('vehicle.view.timeline')}
              </Typography>
              <Timeline detail={detail}/>
            </Card>
          </Grid>
          <Grid item xs={12} md={12}>
            <Card sx={{px: 3, py: 3}}>
              <PhotoView data={detail.photos}/>
            </Card>
            <Card sx={{px: 3, py: 3, mt: 2}}>
              <DocumentView data={detail.documents}/>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>


        </Grid>

      </Container>
    </>
  )
}
