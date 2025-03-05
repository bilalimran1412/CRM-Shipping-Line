import PropTypes from 'prop-types'
// @mui
import {Stack, InputAdornment, TextField, MenuItem, Button, CircularProgress} from '@mui/material'
// components
import Iconify from 'components/iconify'
import FormProvider, {RHFSelect} from "components/hook-form"
import {useForm} from "react-hook-form"
import {useEffect, useState} from "react"
import {getCurrentUrlParamObject} from "../../utils"
import useWatchSearchParams from "../../hooks/useWatchSearchParams"
import {useSearchParams} from "react-router-dom"
import {useLocales} from "../../locales"

export default function FilterToolbar({loading, error, children, onChange, additionalFilters = [], arrayFields = []}) {
  const watchSearchParams = useWatchSearchParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFiltersUsed, setIsFiltersUsed] = useState()
  const {translate} = useLocales()
  const methods = useForm({
    reValidateMode: 'onChange',
    // resolver: yupResolver(FormSchema),
    values: getCurrentUrlParamObject(),
    // defaultValues: {
    //   multiSelect: []
    // },

  })

  const {
    watch,
    reset,
    control,
    setValue,
    handleSubmit,
    formState: {isSubmitting},
  } = methods

  const values = watch()
  const clearSearchParams = () => {
    // Create a new URLSearchParams object with no parameters
    const newSearchParams = new URLSearchParams()

    if (watchSearchParams.hasOwnProperty('page_size')) {
      newSearchParams.set('page_size', watchSearchParams.page_size)
    }
    setSearchParams(newSearchParams)
  }
  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(values)
    }
  }, [values])
  useEffect(() => {
    const isFilterValues = []
    const filterValues = methods.getValues()
    Object.keys(filterValues || {}).forEach(item => {
      if (watchSearchParams.hasOwnProperty(item)) {
        isFilterValues.push(true)
        if (arrayFields.includes(item)) {
          setValue(item, `${watchSearchParams?.[item]}`.split(','))
        } else {
          setValue(item, watchSearchParams?.[item])
        }
      } else {
        setValue(item, null)
      }
    })
    additionalFilters.forEach(item => {
      if (watchSearchParams.hasOwnProperty(item) && !!watchSearchParams?.[item]) {
        isFilterValues.push(true)
      }
    })
    setIsFiltersUsed(isFilterValues.some(item => item === true))
  }, [watchSearchParams])
  return (
    <FormProvider methods={methods}>
      <Stack
        spacing={2}
        alignItems="center"
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        sx={{px: 2.5, py: loading ? 6.5 : 3}}
        className={'relative-block'}
      >
        {loading &&
          <div className='loading-block'>
            <CircularProgress color="primary"/>
          </div>
        }
        {error &&
          <div className='loading-block error'>
            {translate('error.filter')}
          </div>
        }
        <div style={{width: '100%'}}>

        {(!loading && !error) && children}
        </div>


        {(!loading && !error && isFiltersUsed) && (
          <Button
            color="error"
            sx={{flexShrink: 0}}
            onClick={clearSearchParams}
            startIcon={<Iconify icon="eva:trash-2-outline"/>}
          >
            {translate('clear')}
          </Button>
        )}
      </Stack>
    </FormProvider>
  )
}
