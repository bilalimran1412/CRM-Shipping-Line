import PropTypes from 'prop-types'
// form
import {useFormContext, Controller} from 'react-hook-form'
// @mui
import {CircularProgress, FormHelperText} from '@mui/material'
//
import {UploadAvatar, Upload, UploadBox} from '../upload'
import {forwardRef, useImperativeHandle, useState} from "react";

// ----------------------------------------------------------------------

export const RHFUploadAvatar = forwardRef(({name, ...other}, ref) => {
  const {control, setValue} = useFormContext()
  const [uploadLoading, setUploadLoading] = useState(false)
  useImperativeHandle(ref, () => {
    return {
      setLoading(value) {
        setUploadLoading(value)
      },
    };
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => (
        <div>
          <UploadAvatar
            loading={uploadLoading}
            accept={{
              'image/jpeg': [],
              'image/png': [],
            }}
            error={!!error}
            file={field.value}
            {...other}
            helperText={typeof other?.helperText === 'function' ? other?.helperText(field.value) : other?.helperText}
          />
          {!!error && (
            <FormHelperText error sx={{px: 2, textAlign: 'center'}}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  )
})

// ----------------------------------------------------------------------

RHFUploadBox.propTypes = {
  name: PropTypes.string,
}

export function RHFUploadBox({name, ...other}) {
  const {control} = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => (
        <UploadBox files={field.value} error={!!error} {...other} />
      )}
    />
  )
}

// ----------------------------------------------------------------------

RHFUpload.propTypes = {
  name: PropTypes.string,
  multiple: PropTypes.bool,
  helperText: PropTypes.node,
}

export function RHFUpload({name, multiple, helperText, ...other}) {
  const {control} = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) =>
        multiple ? (
          <Upload
            multiple
            accept={{'image/*': []}}
            files={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{px: 2}}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        ) : (
          <Upload
            accept={{'image/*': []}}
            file={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{px: 2}}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        )
      }
    />
  )
}
