import {useCallback, useEffect, useRef} from "react"
import {
  Button,
  Container,
  Divider, Grid,
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
} from "@mui/material"
import {Helmet} from "react-helmet-async"
import {useSearchParams} from "react-router-dom"
import {Link as RouterLink} from 'react-router-dom'
import Iconify from "components/iconify"

import {useLocales} from "locales"
import {useSettingsContext} from 'components/settings'
import useWatchSearchParams from "hooks/useWatchSearchParams"
import useApi from "hooks/useApi"
import {convertNewlinesToBreaks, getCurrentUrlParam} from "utils"
import {store} from "../index"
import {LIST_NAVIGATION, permissions, ROUTE_URL} from "../config"
import {MAIN_NAVIGATION_ROOT} from "routes/paths"

import Datatable from "components/datatable/Datatable"
import CustomBreadcrumbs from "components/custom-breadcrumbs"
import TabFilter from "components/datatable/TabFilter"
import FilterToolbar from "components/datatable/FilterToolbar"
import {RHFAutocomplete, RHFTextField} from "components/hook-form"
import ConfirmDialog from "components/confirm-dialog";
import {useSnackbar} from "components/snackbar";
import {useAuthContext} from "auth/useAuthContext";
import {getCols} from "../utils";
import {LightboxSingleImage} from "../../../../components/lightbox";
// ----------------------------------------------------------------------

export default function PageOne() {
  const {themeStretch} = useSettingsContext()
  const {checkPermission} = useAuthContext()
  const {translate, currentLang} = useLocales()
  const {
    fetchList,
    data,
    page,
    isLoading,
    deleteData,
    error,
    fetchFilterForm,
    filterFormData,
    filterFormError,
    isFilterFormLoading
  } = useApi(store)
  const watchSearchParams = useWatchSearchParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const confirmRef = useRef()
  const {enqueueSnackbar} = useSnackbar()

  useEffect(() => {
    fetchList()
  }, [watchSearchParams])
  useEffect(() => {
    fetchFilterForm()
  }, [])

  const onFilterChange = (name, value) => {
    const params = getCurrentUrlParam()
    params.delete('page')
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    setSearchParams(params)
  }
  const userCanViewAllVehicles = checkPermission('logistic.view_all_customer_vehicles')
  const vinFilter = (
    <Grid item xs={12} md={4}>
      <RHFTextField
        name={'vin'}
        fullWidth
        onChange={value => onFilterChange('vin', value)}
        placeholder={translate('vehicle.filter.vin')}
        size={'small'}
      />
    </Grid>
  )
  const filters = (
    <>
      <FilterToolbar additionalFilters={[]} arrayFields={['status']} loading={isFilterFormLoading}
                     error={filterFormError}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <RHFAutocomplete
              name="status"
              label={translate('vehicle.filter.status')}
              options={filterFormData?.status?.map?.(({id, name}) => ({
                label: name[currentLang.value],
                value: id
              }))}
              multiple
              fullWidth
              filterSelectedOptions
              onChange={value => onFilterChange('status', value.map(({value}) => value).join(','))}
              size={'small'}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RHFAutocomplete
              name="destination"
              label={translate('vehicle.filter.destination')}
              options={filterFormData?.destination?.map?.(({id, country, city}) => ({
                label: `${country?.[currentLang.value]}, ${city?.[currentLang.value]}`,
                value: id
              }))}
              fullWidth
              filterSelectedOptions
              onChange={value => onFilterChange('destination', value)}
              size={'small'}
            />
          </Grid>
          {userCanViewAllVehicles&&
          <Grid item xs={12} md={4}>
            <RHFAutocomplete
              name="customer"
              label={translate('vehicle.filter.customer')}
              options={filterFormData?.customer?.map?.(({id, full_name}) => ({
                label: full_name,
                value: id
              }))}
              fullWidth
              filterSelectedOptions
              onChange={value => onFilterChange('customer', value)}
              size={'small'}
            />
          </Grid>
          }
          {!userCanViewAllVehicles && vinFilter}
        </Grid>
        <Grid container spacing={3} sx={{mt: 0}}>
          {userCanViewAllVehicles && vinFilter}
          <Grid item xs={12} md={userCanViewAllVehicles ? 8 : 12}>
            <RHFTextField
              name={'search'}
              size={'small'}
              fullWidth
              onChange={value => onFilterChange('search', value)}
              placeholder={translate('vehicle.filter.search')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{color: 'text.disabled'}}/>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </FilterToolbar>
      <Divider/>
    </>
  )
  const onDelete = id => {
    confirmRef.current.open({
      title: translate('vehicle.delete.title'),
      content: convertNewlinesToBreaks(translate('vehicle.delete.description')),
      confirmText: translate('delete'),
      confirmColor: 'error',
      cancelText: translate('cancel'),
      cancelColor: 'inherit',
      callback: (close) => {
        deleteData(id, {
          success: data => {
            enqueueSnackbar(translate('vehicle.success.delete'), {
              variant: 'success',
              autoHideDuration: 5 * 1000
            })
            fetchList()
            close()
          },
          error: e => {
            enqueueSnackbar(translate('vehicle.error.delete'), {
              variant: 'error',
              autoHideDuration: 5 * 1000
            })
            close()
          }
        })
      },
    })
  }
  const actions = rows => {
    return (
      <>
        <Tooltip title={translate('delete')}>
          <IconButton color="primary" onClick={onDelete}>
            <Iconify icon="eva:trash-2-outline"/>
          </IconButton>
        </Tooltip>
      </>
    )
  }
  const tableCols = getCols({translate, onDelete, currentLang, checkPermission})

  return (
    <>
      <Helmet>
        <title>{translate('vehicle.title.page')}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={translate('vehicle.title.list')}
          links={[
            {name: translate('breadcrumb.main'), href: MAIN_NAVIGATION_ROOT},
            {name: translate('vehicle.breadcrumb.main'), href: LIST_NAVIGATION},
            {name: translate('vehicle.breadcrumb.list')},
          ]}
          action={
            <Stack direction="row" alignItems="center" spacing={2}>
              {/*<Button*/}
              {/*  variant="contained"*/}
              {/*  startIcon={<Iconify icon="file-icons:microsoft-excel"/>}*/}
              {/*>*/}
              {/*  {translate('export')}*/}
              {/*</Button>*/}
              <Button
                component={RouterLink}
                to={`/${ROUTE_URL}/create`}
                variant="contained"
                color="info"
                startIcon={<Iconify icon="eva:plus-fill"/>}
              >
                {translate('vehicle.create')}
              </Button>
            </Stack>
          }
        />

        <Datatable
          actions={actions}
          filters={filters}
          loading={isLoading}
          data={data}
          page={page}
          cols={tableCols}
          error={error}
          onReload={fetchList}
        />
        <ConfirmDialog ref={confirmRef}/>
      </Container>
    </>
  )
}
