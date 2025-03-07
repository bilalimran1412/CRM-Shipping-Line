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
import {CREATE_PERMISSION, LIST_NAVIGATION, permissions, ROUTE_URL} from "../config"
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
  const groups = useCallback(() => {
    if (filterFormData?.groups && Array.isArray(filterFormData?.groups)) {
      return filterFormData.groups.map(({id, title}) => ({value: id, label: title}))
    }
    return []
  }, [filterFormData])
  const filters = (
    <>
      <FilterToolbar additionalFilters={[]} arrayFields={['status', 'assigned_to']}
                     loading={isFilterFormLoading}
                     error={filterFormError}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <RHFAutocomplete
              name="status"
              label={translate('vehicle-task.filter.status')}
              options={filterFormData?.status?.map?.(({value, label}) => ({
                label: label[currentLang.value],
                value,
              }))}
              multiple
              fullWidth
              filterSelectedOptions
              onChange={value => onFilterChange('status', value.map((value) => value?.value).join(','))}
              size={'small'}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <RHFAutocomplete
              name="assigned_to"
              label={translate('vehicle-task.filter.assigned_to')}
              options={filterFormData?.employees?.map?.(({id, full_name}) => ({
                label: full_name,
                value: id,
              }))}
              multiple
              fullWidth
              filterSelectedOptions
              onChange={value => onFilterChange('assigned_to', value.map((value) => value?.value).join(','))}
              size={'small'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
      title: translate('vehicle-task.delete.title'),
      content: convertNewlinesToBreaks(translate('vehicle-task.delete.description')),
      confirmText: translate('delete'),
      confirmColor: 'error',
      cancelText: translate('cancel'),
      cancelColor: 'inherit',
      callback: (close) => {
        deleteData(id, {
          success: data => {
            enqueueSnackbar(translate('vehicle-task.success.delete'), {
              variant: 'success',
              autoHideDuration: 5 * 1000
            })
            fetchList()
            close()
          },
          error: e => {
            enqueueSnackbar(translate('vehicle-task.error.delete'), {
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

  const tableCols = getCols({translate, currentLang, onDelete, checkPermission, statuses: filterFormData?.status})

  return (
    <>
      <Helmet>
        <title>{translate('vehicle-task.title.page')}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={translate('vehicle-task.title.list')}
          links={[
            {name: translate('breadcrumb.main'), href: MAIN_NAVIGATION_ROOT},
            {name: translate('vehicle-task.breadcrumb.main'), href: LIST_NAVIGATION},
            {name: translate('vehicle-task.breadcrumb.list')},
          ]}
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
