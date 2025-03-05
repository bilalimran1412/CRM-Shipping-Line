import PropTypes from 'prop-types'
// form
import {useFormContext, Controller} from 'react-hook-form'
// @mui
import {IconButton, InputAdornment, TextField} from '@mui/material'
import {DateTimePicker} from "@mui/x-date-pickers";
import Iconify from "../iconify";

// ----------------------------------------------------------------------

RHFDateTimeField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
}

export default function RHFDateTimeField({name, helperText, onChange, ...other}) {
  const {control} = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => {
        return (
          <DateTimePicker
            ampm={false}
            renderInput={(props) => {
              return (
                <TextField
                  size={other.size}
                  {...props}
                  InputProps={{
                    ...props.InputProps,
                    autoComplete: 'off',
                    endAdornment: (
                      <>
                        {field.value &&
                          <InputAdornment position="end">
                            <IconButton edge="end" onClick={() => {
                              field.onChange(null)
                              if (typeof onChange === 'function') {
                                onChange(null)
                              }
                            }}>
                              <Iconify icon={'akar-icons:cross'}/>
                            </IconButton>
                          </InputAdornment>
                        }
                        {props.InputProps.endAdornment}
                      </>
                    )
                  }}
                  fullWidth
                  error={!!error}
                  helperText={error ? error?.message : helperText}
                />
              )
            }}
            label="DateTimePicker"
            {...other}
            value={field.value ? new Date(field.value) : null}
            onChange={date => {
              if (date) {
                try {
                  field.onChange(date.toISOString())
                } catch (e) {
                  field.onChange(date)
                }
              } else {
                field.onChange(date)
              }
              console.log()
              if (typeof onChange === 'function') {
                onChange(date)
              }
            }}
          />
        )
      }}
    />
  )
}
