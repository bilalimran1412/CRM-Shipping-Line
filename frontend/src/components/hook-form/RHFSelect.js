import PropTypes from 'prop-types'
// form
import {useFormContext, Controller} from 'react-hook-form'
// @mui
import {
  Box,
  Chip,
  Select,
  Checkbox,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  FormHelperText, InputAdornment, IconButton,
} from '@mui/material'
import Iconify from "../iconify"
import {el} from "date-fns/locale"
import {useEffect} from "react"

// ----------------------------------------------------------------------

RHFSelect.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  native: PropTypes.bool,
  options: PropTypes.array,
  helperText: PropTypes.node,
  maxHeight: PropTypes.number,
}

export function RHFSelect({
                            name,
                            label,
                            native,
                            clearable,
                            onChange,
                            options = [],
                            helperText,
                            maxHeight = 220,
                            ...other
                          }) {
  const {control} = useFormContext()
  const endAdornment = (field) => (
    <InputAdornment position={'end'} style={{position: 'absolute', right: 40}}>
      <IconButton
        size={'small'}
        onClick={() => {
          field.onChange(null)
          if (typeof onChange === 'function') {
            onChange(null)
          }
        }}
        edge="end"
      >
        <Iconify icon="basil:cross-outline" width={24}/>
      </IconButton>
    </InputAdornment>
  )
  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => (
        <TextField
          {...field}
          label={label}
          select
          fullWidth
          InputProps={{
            endAdornment: clearable && (field.value ? endAdornment(field) : undefined),
          }}
          SelectProps={{
            native,
            MenuProps: {
              PaperProps: {
                sx: {
                  ...(!native && {
                    px: 1,
                    maxHeight: typeof maxHeight === 'number' ? maxHeight : 'unset',
                    '& .MuiMenuItem-root': {
                      px: 1,
                      borderRadius: 0.75,
                      typography: 'body2',
                      textTransform: 'capitalize',
                    },
                  }),
                },
              },
            },
            sx: {textTransform: 'capitalize'},
          }}

          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
          value={!!field.value ? field.value : ''}
          onChange={(event) => {
            field.onChange(event)
            if (typeof onChange === 'function') {
              onChange(event.target.value || null)
            }
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}

// ----------------------------------------------------------------------

RHFMultiSelect.propTypes = {
  name: PropTypes.string,
  chip: PropTypes.bool,
  label: PropTypes.string,
  options: PropTypes.array,
  checkbox: PropTypes.bool,
  placeholder: PropTypes.string,
  helperText: PropTypes.node,
  sx: PropTypes.object,
}

export function RHFMultiSelect({
                                 name,
                                 chip,
                                 label,
                                 options,
                                 checkbox,
                                 placeholder,
                                 helperText,
                                 sx,
                                 onChange,
                                 ...other
                               }) {
  const {control, getValues, setValue} = useFormContext()

  const renderValues = (selectedIds) => {
    const selectedItems = options.filter((item) => selectedIds.includes(item.value))

    if (!selectedItems.length && placeholder) {
      return (
        <Box component="em" sx={{color: 'text.disabled'}}>
          {placeholder}
        </Box>
      )
    }

    if (chip) {
      return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
          {selectedItems.map((item) => (
            <Chip key={item.value} size="small" label={item.label}/>
          ))}
        </Box>
      )
    }

    return selectedItems.map((item) => item.label).join(', ')
  }
  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => {
        return (
          <FormControl sx={sx}>
            {label && <InputLabel id={name}> {label} </InputLabel>}
            <Select
              {...field}
              multiple
              displayEmpty={!!placeholder}
              labelId={name}
              input={<OutlinedInput fullWidth label={label} error={!!error}/>}
              renderValue={renderValues}
              MenuProps={{
                PaperProps: {
                  sx: {px: 1, maxHeight: 280},
                },
              }}
              {...other}
              value={!!field.value ? field.value : []}
              onChange={(event) => {
                field.onChange(event)
                if (typeof onChange === 'function') {
                  onChange(event.target.value || null)
                }
              }}
            >
              {placeholder && (
                <MenuItem
                  disabled
                  value=""
                  sx={{
                    py: 1,
                    px: 2,
                    borderRadius: 0.75,
                    typography: 'body2',
                  }}
                >
                  <em> {placeholder} </em>
                </MenuItem>
              )}

              {options.map((option) => {
                const selected = (field.value || []).includes(option.value)

                return (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{
                      py: 1,
                      px: 2,
                      borderRadius: 0.75,
                      typography: 'body2',
                      ...(selected && {
                        fontWeight: 'fontWeightMedium',
                      }),
                      ...(checkbox && {
                        p: 0.25,
                      }),
                    }}
                  >
                    {checkbox && <Checkbox disableRipple size="small" checked={selected}/>}

                    {option.label}
                  </MenuItem>
                )
              })}
            </Select>

            {(!!error || helperText) && (
              <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
            )}
          </FormControl>
        )
      }}
    />
  )
}
