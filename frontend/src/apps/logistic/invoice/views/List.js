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
import {getCols, renderCollapse, vehicleCols} from "../utils";
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
  const {themeMode} = useSettingsContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const confirmRef = useRef()
  const {enqueueSnackbar} = useSnackbar()

  useEffect(() => {
    fetchList()
  }, [watchSearchParams])

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
      <FilterToolbar additionalFilters={[]} arrayFields={[]}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <RHFTextField
              name={'search'}
              size={'small'}
              fullWidth
              onChange={value => onFilterChange('search', value)}
              placeholder={translate('invoice.filter.search')}
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
      title: translate('invoice.delete.title'),
      content: convertNewlinesToBreaks(translate('invoice.delete.description')),
      confirmText: translate('delete'),
      confirmColor: 'error',
      cancelText: translate('cancel'),
      cancelColor: 'inherit',
      callback: (close) => {
        deleteData(id, {
          success: data => {
            enqueueSnackbar(translate('invoice.success.delete'), {
              variant: 'success',
              autoHideDuration: 5 * 1000
            })
            fetchList()
            close()
          },
          error: e => {
            enqueueSnackbar(translate('invoice.error.delete'), {
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

  const tableCols = getCols({translate, currentLang, onDelete, checkPermission})
  const collapseCols = vehicleCols({translate, onDelete, currentLang, checkPermission, disableActions: true})
  return (
    <>
      <Helmet>
        <title>{translate('invoice.title.page')}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={translate('invoice.title.list')}
          links={[
            {name: translate('breadcrumb.main'), href: MAIN_NAVIGATION_ROOT},
            {name: translate('invoice.breadcrumb.main'), href: LIST_NAVIGATION},
            {name: translate('invoice.breadcrumb.list')},
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
                  to={`/${ROUTE_URL}/create`}
                  variant="contained"
                  color="info"
                  startIcon={<Iconify icon="eva:plus-fill"/>}
                >
                  {translate('invoice.create')}
                </Button>
              }
            </Stack>
          }
        />

        <Datatable
          collapse
          collapseRender={row => renderCollapse({
            data: (row?.vehicles || []),
            tableCols: collapseCols,
            themeMode,
            translate
          })}
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
