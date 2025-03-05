import PropTypes from 'prop-types'
// form
import {useFormContext, Controller} from 'react-hook-form'
// @mui
import {Autocomplete, TextField} from '@mui/material'
import {useEffect} from "react";

// ----------------------------------------------------------------------

RHFAutocomplete.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
}

export default function RHFAutocomplete({name, label, helperText, onChange, ...other}) {
  const {control, setValue, watch} = useFormContext()

  const setValues = (fieldValue) => {
    if (other.multiple) {
      if (other.options && fieldValue && Array.isArray(fieldValue)) {
        let data = fieldValue
        if (data) {
          data = fieldValue.map(item => {
            if (typeof item !== 'object') {
              return other.options.find(({value}) => value == item)
            } else {
              const values = other.options.find(({value}) => value == item?.id)
              // setValue(name, values)
              return values
            }
          }).filter(item => !!item)
        }
        return data
      }
      return fieldValue || []
    }
    if (!Array.isArray(fieldValue) && typeof fieldValue === 'object' && fieldValue?.id) {
      fieldValue = fieldValue.id
    }
    return other?.options?.find?.(({value}) => value == fieldValue) || ''
  }
  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => {
        return (
          <Autocomplete
            {...field}
            onChange={(event, newValue) => {
              let value = newValue
              if (newValue && typeof newValue === 'object' && !Array.isArray(newValue)) {
                value = newValue?.value
              }
              setValue(name, value, {shouldValidate: true})
              if (typeof onChange === 'function') {
                onChange(value || null)
              }
            }}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.value}>
                  {option.label}
                </li>
              );
            }}
            renderInput={(params) => {
              return (
                <TextField
                  label={label}
                  error={!!error}
                  helperText={error ? error?.message : helperText}
                  {...params}
                />
              )
            }}
            value={setValues(field.value) || (other.multiple ? [] : null)}
            getOptionLabel={(option) => option?.label}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            {...other}
            options={other?.options || []}
          />
        )
      }}
    />
  )
}
