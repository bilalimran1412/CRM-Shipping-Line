import PropTypes from 'prop-types'
import { useEffect } from 'react'
// form
import { useFormContext, Controller } from 'react-hook-form'
// @mui
import { FormHelperText } from '@mui/material'
//
import Editor from '../editor'

// ----------------------------------------------------------------------

RHFEditor.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
}

export default function RHFEditor({ name, helperText, ...other }) {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitSuccessful },
  } = useFormContext()

  const values = watch()

  useEffect(() => {
    if (values[name] === '<p><br></p>') {
      setValue(name, '', {
        shouldValidate: !isSubmitSuccessful,
      })
    }
  }, [isSubmitSuccessful, name, setValue, values])

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Editor
          id={name}
          value={field.value}
          onChange={field.onChange}
          error={!!error}
          helperText={
            (!!error || helperText) && (
              <FormHelperText error={!!error} sx={{ px: 2 }}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )
          }
          {...other}
        />
      )}
    />
  )
}
