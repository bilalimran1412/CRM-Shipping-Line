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
import {
  CREATE_PERMISSION,
  LIST_NAVIGATION,
  permissions,
  ROUTE_URL
} from "../config"
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
// ----------------------------------------------------------------------
import {LIST_NAVIGATION as TEMPLATE_LIST_NAVIGATION} from '../../customer-invoice-detail-template/config'
import RHFDateField from "../../../../components/hook-form/RHFDateField";
import {fDate} from "../../../../utils/formatTime";
import {useState} from "react";
import axios from "../../../../utils/axios";
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
    isFilterFormLoading,
    context
  } = useApi(store)
  const watchSearchParams = useWatchSearchParams()
  const {themeMode} = useSettingsContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const confirmRef = useRef()
  const {enqueueSnackbar} = useSnackbar()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchList()
  }, [watchSearchParams])
  useEffect(() => {
    fetchFilterForm()
  }, [])

  const onFilterChange = (name, value) => {
    console.log('name', name, 'value', value)
    const params = getCurrentUrlParam()
    params.delete('page')
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    setSearchParams(params)
  }
  const groups = useCallback(() => {
    if (filterFormData?.groups && Array.isArray(filterFormData?.groups)) {
      return filterFormData.groups.map(({id, title}) => ({value: id, label: title}))
    }
    return []
  }, [filterFormData])
  const filters = (
    <>
      <FilterToolbar additionalFilters={[]} arrayFields={['status', 'template', 'customer']}
                     loading={isFilterFormLoading}
                     error={filterFormError}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <RHFAutocomplete
              name="customer"
              label={translate('customer-invoice.filter.customer')}
              size={'small'}
              options={filterFormData?.customer?.map?.((item) => {
                return {
                  label: item.full_name,
                  value: item.id,
                }
              })}
              multiple
              fullWidth
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              onChange={value => onFilterChange('customer', value.map((value) => value.value).join(','))}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RHFAutocomplete
              name="status"
              label={translate('customer-invoice.filter.status')}
              options={filterFormData?.status?.map?.(({value, label}) => ({
                label: label[currentLang.value],
                value,
              }))}
              multiple
              fullWidth
              filterSelectedOptions
              onChange={value => onFilterChange('status', value.map((value) => value.value).join(','))}
              size={'small'}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <RHFDateField
              size={'small'}
              name={`date_start`}
              label={translate('customer-invoice.filter.date_start')}
              onChange={value => onFilterChange('date_start', fDate(value, 'dd/MM/yyyy'))}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <RHFDateField
              size={'small'}
              name={`date_end`}
              label={translate('customer-invoice.filter.date_end')}
              minDate={searchParams.get('date_start')}
              onChange={value => onFilterChange('date_end', fDate(value, 'dd/MM/yyyy'))}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{mt: 0}}>
          <Grid item xs={12} md={4}>
            <RHFAutocomplete
              name="template"
              label={translate('customer-invoice.filter.template')}
              options={filterFormData?.templates?.map?.(({value, name}) => ({
                label: name[currentLang.value],
                value,
              }))}
              multiple
              fullWidth
              filterSelectedOptions
              onChange={value => onFilterChange('template', value.join(','))}
              size={'small'}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <RHFTextField
              name={'search'}
              size={'small'}
              fullWidth
              onChange={value => onFilterChange('search', value)}
              placeholder={translate('shipment.filter.search')}
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
  const onDownload = async (id) => {
    setLoading(true)
    try {
      const response = await axios.get(`finance/customer-invoice/${id}/generate/`)
      window.open(response.data.file, '_blank')
    } catch (e) {
      enqueueSnackbar(translate('customer-invoice.error.download'), {
        variant: 'error',
        autoHideDuration: 5 * 1000
      })
    }
    finally {
      setLoading(false)
    }
  }
  const onDelete = id => {
    confirmRef.current.open({
      title: translate('customer-invoice.delete.title'),
      content: convertNewlinesToBreaks(translate('customer-invoice.delete.description')),
      confirmText: translate('delete'),
      confirmColor: 'error',
      cancelText: translate('cancel'),
      cancelColor: 'inherit',
      callback: (close) => {
        deleteData(id, {
          success: data => {
            enqueueSnackbar(translate('customer-invoice.success.delete'), {
              variant: 'success',
              autoHideDuration: 5 * 1000
            })
            fetchList()
            close()
          },
          error: e => {
            enqueueSnackbar(translate('customer-invoice.error.delete'), {
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

  const tableCols = getCols({translate, currentLang, onDelete, onDownload, checkPermission, context})
  return (
    <>
      <Helmet>
        <title>{translate('customer-invoice.title.page')}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={translate('customer-invoice.title.list')}
          links={[
            {name: translate('breadcrumb.main'), href: MAIN_NAVIGATION_ROOT},
            {name: translate('customer-invoice.breadcrumb.main'), href: LIST_NAVIGATION},
            {name: translate('customer-invoice.breadcrumb.list')},
          ]}
          action={
            <Stack direction="row" alignItems="center" spacing={2}>
              {/*<Button*/}
              {/*  variant="contained"*/}
              {/*  startIcon={<Iconify icon="file-icons:microsoft-excel"/>}*/}
              {/*>*/}
              {/*  {translate('export')}*/}
              {/*</Button>*/}
              {checkPermission(CREATE_PERMISSION) &&
                <Button
                  component={RouterLink}
                  to={`${TEMPLATE_LIST_NAVIGATION}`}
                  variant="outlined"
                  color="success"
                  startIcon={<Iconify icon="gg:template"/>}
                >
                  {translate('customer-invoice.templates')}
                </Button>
              }
              {checkPermission(CREATE_PERMISSION) &&
                <Button
                  component={RouterLink}
                  to={`/${ROUTE_URL}/create`}
                  variant="contained"
                  color="info"
                  startIcon={<Iconify icon="eva:plus-fill"/>}
                >
                  {translate('customer-invoice.create')}
                </Button>
              }
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
