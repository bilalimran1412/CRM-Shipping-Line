import {Helmet} from 'react-helmet-async'
import {paramCase} from 'change-case'
import {useNavigate, useParams, useSearchParams} from 'react-router-dom'
// @mui
import {CircularProgress, Container} from '@mui/material'
// routes
import {MAIN_NAVIGATION_ROOT, PATH_DASHBOARD} from 'routes/paths'
// _mock_
// components
import {useSettingsContext} from 'components/settings'
import CustomBreadcrumbs from 'components/custom-breadcrumbs'
// sections
import Form from '../components/Form'
import useApi from "../../../../hooks/useApi"
import {store} from "../index"
import {useEffect, useMemo} from "react"
import {useSnackbar} from "components/snackbar"
import {searchParamsFromJSON} from "../../../../utils"
import {LIST_NAVIGATION, ROUTE_URL} from "../config"
import {useLocales} from "../../../../locales";
import Error from "../../../../components/error";
import {fDate} from "../../../../utils/formatTime";

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const {themeStretch} = useSettingsContext()
  const {id} = useParams()
  const {translate} = useLocales()

  const {fetchForm, isFormLoading, formError, formData, clearFormData, updateData, isSubmitting} = useApi(store)

  const {enqueueSnackbar} = useSnackbar()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  useEffect(() => {
    fetchForm(id)
    return () => {
      clearFormData()
    }
  }, [])
  const defaultValues = useMemo(
    () => {
      if (formData?.data) {
        return formData.data
      }
      return {}
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData]
  )
  const onSubmit = values => {
    const data = {
      ...values,
      icon: values?.icon?.id || null,
    }
    updateData(id, data, {
      success: data => {
        enqueueSnackbar(translate('shipment-type.success.edit'), {
          variant: 'success',
          autoHideDuration: 5 * 1000
        })
        const params = searchParamsFromJSON(searchParams)
        navigate(`/${ROUTE_URL}${params}`)
      },
      error: e => {
        enqueueSnackbar(translate('shipment-type.error.edit'), {
          variant: 'error',
          autoHideDuration: 5 * 1000
        })
      }
    })
  }
  if (formError) {
    return (
      <Error code={formError?.status}/>
    )
  }
  return (
    <>
      <Helmet>
        <title>{translate('shipment-type.title.edit')}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'} className='relative-block'>
        {isFormLoading &&
          <div className='loading-block'>
            <CircularProgress color="primary"/>
          </div>
        }
        <CustomBreadcrumbs
          heading={translate('shipment-type.title.edit')}
          links={[
            {name: translate('breadcrumb.main'), href: MAIN_NAVIGATION_ROOT},
            {name: translate('shipment-type.breadcrumb.main'), href: LIST_NAVIGATION},
            {name: translate('shipment-type.breadcrumb.edit')},
          ]}
        />

        <Form isEdit data={defaultValues} formData={formData} onSubmit={onSubmit} isSubmitting={isSubmitting}/>
      </Container>
    </>
  )
}
