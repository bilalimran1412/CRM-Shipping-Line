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


export default function View() {
  const {themeStretch, themeMode} = useSettingsContext()
  const {id} = useParams()
  const {translate} = useLocales()

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
        <title>{translate('vehicle-task-type.title.view')}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'} className='relative-block'>
        <CustomBreadcrumbs
          heading={translate('vehicle-task-type.title.view')}
          links={[
            {name: translate('breadcrumb.main'), href: MAIN_NAVIGATION_ROOT},
            {name: translate('vehicle-task-type.breadcrumb.main'), href: LIST_NAVIGATION},
            {name: translate('vehicle-task-type.breadcrumb.view')},
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
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
                        <TableCell>ID</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {detail.id}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{translate('vehicle-task-type.form.name')}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {detail.name}
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
