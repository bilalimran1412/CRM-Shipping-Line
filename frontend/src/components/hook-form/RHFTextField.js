import PropTypes from 'prop-types'
// form
import {useFormContext, Controller} from 'react-hook-form'
// @mui
import {TextField} from '@mui/material'

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
}

export default function RHFTextField({name, helperText, onChange, ...other}) {
  const {control} = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => (
        <TextField
          {...field}
          fullWidth
          value={(typeof field.value === 'number' && field.value === 0 ? '' : field.value) || ''}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
          onChange={(event) => {
            field.onChange(event)
            if (typeof onChange === 'function') {
              onChange(event.target.value || '')
            }
          }}
        />
      )}
    />
  )
}
