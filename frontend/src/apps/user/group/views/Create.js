import {Helmet} from 'react-helmet-async'
import {paramCase} from 'change-case'
import {useNavigate, useParams, useSearchParams} from 'react-router-dom'
// @mui
import {CircularProgress, Container} from '@mui/material'
// routes
import {MAIN_NAVIGATION_ROOT} from 'routes/paths'
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

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const {themeStretch} = useSettingsContext()
  const {id} = useParams()
  const {translate} = useLocales()

  const {fetchForm, isFormLoading, formError, formData, clearFormData, createData, isSubmitting} = useApi(store)

  const {enqueueSnackbar} = useSnackbar()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const onSubmit = values => {
    const data = {
      ...values,
    }
    createData(data, {
      success: data => {
        enqueueSnackbar(translate('group.success.create'), {
          variant: 'success',
          autoHideDuration: 5 * 1000
        })
        navigate(`/${ROUTE_URL}`)
      },
      error: e => {
        enqueueSnackbar(translate('group.error.create'), {
          variant: 'error',
          autoHideDuration: 5 * 1000
        })
      }
    })
  }
  if(formError) {
    return (
      <Error code={formError?.status}/>
    )
  }
  return (
    <>
      <Helmet>
        <title> User: Edit user | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'} className='relative-block'>
        {isFormLoading &&
          <div className='loading-block'>
            <CircularProgress color="primary"/>
          </div>
        }
        <CustomBreadcrumbs
          heading={translate('group.title.create')}
          links={[
            {name: translate('breadcrumb.main'), href: MAIN_NAVIGATION_ROOT},
            {name: translate('group.breadcrumb.main'), href: LIST_NAVIGATION},
            {name: translate('group.breadcrumb.create')},
          ]}
        />

        <Form formData={formData} onSubmit={onSubmit} isSubmitting={isSubmitting}/>
      </Container>
    </>
  )
}
