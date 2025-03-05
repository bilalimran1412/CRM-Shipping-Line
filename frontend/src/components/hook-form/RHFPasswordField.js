import PropTypes from 'prop-types'
// form
import {useFormContext, Controller} from 'react-hook-form'
// @mui
import {IconButton, InputAdornment, TextField} from '@mui/material'
import {useState} from "react";
import Iconify from "../iconify";

// ----------------------------------------------------------------------

RHFPasswordField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
}

export default function RHFPasswordField({name, helperText, onChange, ...other}) {
  const {control} = useFormContext()
  const [showPassword, setShowPassword] = useState(false);

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
          type={showPassword ? 'text' : 'password'}
          {...other}
          onChange={(event) => {
            field.onChange(event)
            if (typeof onChange === 'function') {
              onChange(event.target.value || '')
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  )
}
