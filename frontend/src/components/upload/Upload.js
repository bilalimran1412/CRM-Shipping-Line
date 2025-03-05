import PropTypes from 'prop-types'
import {useDropzone} from 'react-dropzone'
// @mui
import {Box, Stack, Button, IconButton, Typography} from '@mui/material'
import {styled, alpha} from '@mui/material/styles'
// assets
import {UploadIllustration} from '../../assets/illustrations'
//
import Iconify from '../iconify'
//
import RejectionFiles from './errors/RejectionFiles'
import MultiFilePreview from './preview/MultiFilePreview'
import SingleFilePreview from './preview/SingleFilePreview'
import {useLocales} from "../../locales";

// ----------------------------------------------------------------------

const StyledDropZone = styled('div')(({theme}) => ({
  outline: 'none',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
  '&:hover': {
    opacity: 0.72,
  },
}))

// ----------------------------------------------------------------------

Upload.propTypes = {
  sx: PropTypes.object,
  error: PropTypes.bool,
  files: PropTypes.array,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  onDelete: PropTypes.func,
  onRemove: PropTypes.func,
  onUpload: PropTypes.func,
  thumbnail: PropTypes.bool,
  helperText: PropTypes.node,
  onRemoveAll: PropTypes.func,
}

export default function Upload({
                                 uploadState,
                                 disabled,
                                 multiple = false,
                                 error,
                                 helperText,
                                 //
                                 file,
                                 onDelete,
                                 //
                                 files,
                                 thumbnail,
                                 onUpload,
                                 onRemove,
                                 onRemoveAll,
                                 sx,
                                 CustomPlaceholder,
                                 ...other
                               }) {
  const {getRootProps, getInputProps, isDragActive, isDragReject, fileRejections} = useDropzone({
    multiple,
    disabled,
    ...other,
  })


  const {translate} = useLocales()

  const hasFile = !!file && !multiple

  const hasFiles = files && multiple && files.length > 0

  const isError = isDragReject || !!error

  return (
    <Box sx={{width: 1, position: 'relative', ...sx}}>
      <StyledDropZone
        {...getRootProps()}
        sx={{
          padding: 2,
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(isError && {
            color: 'error.main',
            bgcolor: 'error.lighter',
            borderColor: 'error.light',
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasFile && {
            padding: '12% 0',
          }),
        }}
      >
        <input {...getInputProps()} />
        {CustomPlaceholder ? CustomPlaceholder :
          <Placeholder
            sx={{
              ...(hasFile && {
                opacity: 0,
              }),
            }}
          />
        }

        {hasFile && <SingleFilePreview file={file}/>}
      </StyledDropZone>

      {helperText && helperText}

      <RejectionFiles fileRejections={fileRejections}/>

      {hasFile && onDelete && (
        <IconButton
          size="small"
          onClick={onDelete}
          sx={{
            top: 16,
            right: 16,
            zIndex: 9,
            position: 'absolute',
            color: (theme) => alpha(theme.palette.common.white, 0.8),
            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
            },
          }}
        >
          <Iconify icon="eva:close-fill" width={18}/>
        </IconButton>
      )}

      {hasFiles && (
        <>
          <Box sx={{my: 3}}>
            <MultiFilePreview files={files} uploadState={uploadState?.uploadState} thumbnail={thumbnail} onRemove={onRemove}/>
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            {onRemoveAll && (
              <Button color="inherit" variant="outlined" size="small" onClick={onRemoveAll}>
                {translate('dropzone.clear')}
              </Button>
            )}

            {onUpload && (
              <Button size="small" variant="contained" onClick={onUpload}>
                {translate('dropzone.upload_files')}
              </Button>
            )}
          </Stack>
        </>
      )}
    </Box>
  )
}

// ----------------------------------------------------------------------

Placeholder.propTypes = {
  sx: PropTypes.object,
}

function Placeholder({sx, ...other}) {
  const {translate} = useLocales()
  return (
    <Stack
      spacing={5}
      alignItems="center"
      justifyContent="center"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        width: 1,
        textAlign: {
          xs: 'center',
          md: 'left',
        },
        ...sx,
      }}
      {...other}
    >
      <UploadIllustration sx={{width: 100}}/>

      <div>
        <Typography gutterBottom variant="h5">
          {translate('dropzone.drop_or_select')}
        </Typography>

        <Typography variant="body2" sx={{color: 'text.secondary'}}>
          {translate('dropzone.drop_or_click')}
          <Typography
            variant="body2"
            component="span"
            sx={{
              mx: 0.5,
              color: 'primary.main',
              textDecoration: 'underline',
            }}
          >
            {translate('dropzone.browse')}
          </Typography>
          {translate('dropzone.thorough_your_machine')}
        </Typography>
      </div>
    </Stack>
  )
}
