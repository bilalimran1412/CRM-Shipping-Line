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
import Iconify from "../../../../components/iconify";
import {CustomAvatar} from "../../../../components/custom-avatar";
import {LightboxSingleImage} from "../../../../components/lightbox";
import StatByStatus from "../components/StatByStatus";
import StatByUserVehicle from "../components/StatByUserVehicle";
import MyDeliveryStats from "../components/MyDeliveryStats";
import StatByDestination from "../components/StatByDestination";
import StatCustomerFinance from "../components/StatCustomerFinance";
import MyFinances from "../components/MyFinances";
import StatByStatusChart from "../components/StatByStatusChart";
import TotalVehicle from "../components/TotalVehicle";
import TotalCustomer from '../components/TotalCustomer';
import TotalShipment from '../components/TotalShipment';
import StatByDestinationChart from '../components/StatByDestinationChart';
import StatByUserVehicleChart from '../components/StatByUserVehicleChart';


export default function View() {
  const {themeStretch, themeMode} = useSettingsContext()
  const {id} = useParams()
  const {translate} = useLocales()

  const {fetchList, error, data, isLoading} = useApi(store)

  const {enqueueSnackbar} = useSnackbar()
  const navigate = useNavigate()
  const avatarRef = useRef()
  useEffect(() => {
    fetchList()
  }, [])

  if (error) {
    return (
      <Error code={error?.status}/>
    )
  }

  if (isLoading) {
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
        <title>{translate('logistic-dashboard.title.page')}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'} className='relative-block'>
        {/*<Grid container spacing={3}>*/}
        {/*  <Grid item xs={12} md={4}>*/}
        {/*    {JSON.stringify(data)}*/}
        {/*  </Grid>*/}
        {/*</Grid>*/}
        <Grid container spacing={3} sx={{mt: 2}}>
          <Grid item xs={12} md={4}>
            <TotalVehicle total={data?.total_vehicles}/>
          </Grid>
          <Grid item xs={12} md={4}>
            <TotalCustomer total={data?.total_customers}/>
          </Grid>
          <Grid item xs={12} md={4}>
            <TotalShipment total={data?.total_shipments}/>
          </Grid>
          <Grid item xs={12} md={8}>
            <StatByStatus data={data?.statuses_with_vehicle_count}/>
            {/*{data?.is_customer && <MyDeliveryStats data={data?.users_by_vehicles_count.customers[0]}/>}*/}
          </Grid>
          <Grid item xs={12} md={4}>
            <StatByStatusChart data={data?.statuses_with_vehicle_count}/>
          </Grid>
          {!data?.is_customer &&
            <Grid item xs={12} md={12}>
              <StatCustomerFinance data={data?.user_finances} currency={data.primary_currency}/>
              {/*{data?.is_customer && <MyDeliveryStats data={data?.users_by_vehicles_count.customers[0]}/>}*/}
            </Grid>
          }
          {data?.is_customer &&
            <>
              <Grid item xs={12} md={6}>
                <MyDeliveryStats data={data?.users_by_vehicles_count.customers[0]}/>
              </Grid>
              <Grid item xs={12} md={6}>
                <MyFinances data={data?.user_finances[0]} currency={data.primary_currency}/>
              </Grid>
            </>
          }
          <Grid item xs={12} md={6}>
            <StatByDestinationChart data={data?.vehicles_by_destination} />
          </Grid>
          <Grid item xs={12} md={6}>
            <StatByDestination data={data?.vehicles_by_destination}/>
          </Grid>

          {!data?.is_customer && 
          <>
            <Grid item xs={12} md={6}>
              <StatByUserVehicle data={data?.users_by_vehicles_count}/>
            </Grid> 
            <Grid item xs={12} md={6}>
              <StatByUserVehicleChart data={data?.users_by_vehicles_count}/>
            </Grid> 
          </>
          }
        </Grid>
      </Container>
    </>
  )
}