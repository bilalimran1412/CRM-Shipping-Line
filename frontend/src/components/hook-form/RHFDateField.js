import PropTypes from 'prop-types'
// form
import {useFormContext, Controller} from 'react-hook-form'
// @mui
import {IconButton, InputAdornment, TextField} from '@mui/material'
import {DateTimePicker, DesktopDatePicker} from "@mui/x-date-pickers";
import Iconify from "../iconify";
import useLocales from "../../locales/useLocales";

// ----------------------------------------------------------------------

RHFDateField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
}

export default function RHFDateField({name, helperText, onChange, ...other}) {
  const {control} = useFormContext()
  const { currentLang } = useLocales()

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => {
        return (
          <DesktopDatePicker

            localeText={{}}
            // localeText={currentLang.systemValue.components.MuiLocalizationProvider.defaultProps.localeText}
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
