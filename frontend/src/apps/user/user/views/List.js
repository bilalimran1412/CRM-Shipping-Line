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
  const {translate} = useLocales()
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
  const avatarRef = useRef()
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
      <TabFilter
        defaultValue={'all'}
        name={'status'}
        options={[
          {
            label: translate('user.filter.tab.all'),
            value: 'all'
          },
          {
            label: translate('user.filter.tab.active'),
            value: 'active'
          },
          {
            label: translate('user.filter.tab.not_active'),
            value: 'not-active'
          },
        ]}
      />

      <FilterToolbar additionalFilters={['status']} arrayFields={['type', 'groups']} loading={isFilterFormLoading}
                     error={filterFormError}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <RHFAutocomplete
              name="groups"
              label={translate('user.filter.group')}
              options={groups()}
              multiple
              fullWidth
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              filterSelectedOptions
              onChange={value => onFilterChange('groups', value.map(({value}) => value).join(','))}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RHFAutocomplete
              name="type"
              label={translate('user.filter.type.label')}
              options={[
                {
                  label: translate('user.filter.type.staff'),
                  value: 'staff'
                },
                {
                  label: translate('user.filter.type.superuser'),
                  value: 'superuser'
                },
              ]}
              multiple
              fullWidth
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              filterSelectedOptions
              onChange={value => onFilterChange('type', value.map(({value}) => value).join(','))}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RHFTextField
              name={'search'}
              fullWidth
              onChange={value => onFilterChange('search', value)}
              placeholder={translate('user.filter.search')}
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
      title: translate('user.delete.title'),
      content: convertNewlinesToBreaks(translate('user.delete.description')),
      confirmText: translate('delete'),
      confirmColor: 'error',
      cancelText: translate('cancel'),
      cancelColor: 'inherit',
      callback: (close) => {
        deleteData(id, {
          success: data => {
            enqueueSnackbar(translate('user.success.delete'), {
              variant: 'success',
              autoHideDuration: 5 * 1000
            })
            fetchList()
            close()
          },
          error: e => {
            enqueueSnackbar(translate('user.error.delete'), {
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
  const onClickAvatar = row => {
    if(row.avatar && row.avatar.file){
      avatarRef.current.open(row.avatar.file)
    }
  }
  const tableCols = getCols({translate, onDelete, onClickAvatar, checkPermission})

  return (
    <>
      <Helmet>
        <title>{translate('user.title.page')}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={translate('user.title.list')}
          links={[
            {name: translate('breadcrumb.main'), href: MAIN_NAVIGATION_ROOT},
            {name: translate('user.breadcrumb.main'), href: LIST_NAVIGATION},
            {name: translate('user.breadcrumb.list')},
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
                {translate('user.create')}
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
        <LightboxSingleImage ref={avatarRef}/>
      </Container>
    </>
  )
}
