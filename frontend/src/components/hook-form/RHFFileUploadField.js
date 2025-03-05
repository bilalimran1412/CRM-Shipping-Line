// form
import {useFormContext, Controller} from 'react-hook-form'
// @mui
import {Badge, IconButton, InputAdornment, Link, Stack, TextField} from '@mui/material'
import Iconify from "../iconify";
import {useLocales} from "../../locales";
import {useRef, useState} from "react";
import {uploadFile} from "../../utils/file";
import {useSnackbar} from "../snackbar";

// ----------------------------------------------------------------------
export default function RHFFileUploadField({name, type, helperText, onChange, ...other}) {
  const {control, setValue} = useFormContext()
  const [upload, setUpload] = useState({uploading: false, error: null, progress: null})
  const {translate} = useLocales()
  const {enqueueSnackbar} = useSnackbar()
  const fileInputRef = useRef(null);
  const onFileChoose = () => {
    // Programmatically click the file input element
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    if (event.target.files.length === 0) return null
    const file = event.target.files[0];
    console.log(file);
    uploadFile({
      file,
      type,
      setUploadState: progress => {
        setUpload(state => ({...state, uploading: true, progress}))
      },
      success: data => {
        fileInputRef.current.value = ''
        setValue(name, data, {shouldValidate: true})
        setUpload({uploading: false})
        if (typeof onChange === 'function') {
          onChange(data)
        }
      },
      error: () => {
        fileInputRef.current.value = ''
        setValue(name, null)
        setUpload({uploading: false, error: true})
        enqueueSnackbar(translate('upload_error'), {
          variant: 'error',
          autoHideDuration: 5 * 1000
        })
      }
    })
  };
  const getBadgeContent = () => {
    if (!upload.uploading) return ''
    if (upload.uploading && upload.progress) return `${upload.progress}%`
    if (upload.error) return translate('upload_error')
  }
  const getInputContent = (field) => {
    if (upload.uploading) {
      return translate('uploading')
    }
    if (field?.value?.name) {
      return field?.value?.name
    } else {
      return translate('select_file')
    }
  }
  const onClear = () => {
    setValue(name, null)
  }
  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => (
        <div className={'file-field'}>
          <input
            type="file"
            ref={fileInputRef}
            className={'hidden'}
            onChange={handleFileChange}
          />
          <Badge
            badgeContent={getBadgeContent()}
            color="success"
            className={(!upload.uploading) ? 'hide' : ''}
          >
            <TextField
              {...field}
              fullWidth
              value={(typeof field.value === 'number' && field.value === 0 ? '' : field.value) || ''}
              error={!!error}
              helperText={error ? error?.message : helperText}
              {...other}
              InputProps={{
                spellCheck: false,
                value: getInputContent(field),
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'ph:file'}/>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Stack spacing={1} direction={'row'}>
                      {field.value?.name ?
                        <>
                          <Link href={field.value.file} target="_blank">
                            <IconButton edge="end" size={'small'}>
                              <Iconify icon={'ph:link'}/>
                            </IconButton>
                          </Link>
                          <IconButton edge="end" onClick={onClear} size={'small'}>
                            <Iconify icon={'akar-icons:cross'}/>
                          </IconButton>
                        </>
                        :
                        <IconButton edge="end" onClick={onFileChoose} size={'small'}>
                          <Iconify icon={'octicon:upload-16'}/>
                        </IconButton>
                      }
                    </Stack>
                  </InputAdornment>
                ),
              }}
            />
          </Badge>
        </div>
      )}
    />
  )
}
