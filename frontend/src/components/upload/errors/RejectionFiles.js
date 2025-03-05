import PropTypes from 'prop-types'
// @mui
import {alpha} from '@mui/material/styles'
import {Box, Paper, Typography} from '@mui/material'
// utils
import {extractIntegers, fData} from '../../../utils/formatNumber'
//
import {fileData} from '../../file-thumbnail'
import {useCallback} from "react";
import {useLocales} from "../../../locales";

// ----------------------------------------------------------------------

RejectionFiles.propTypes = {
  fileRejections: PropTypes.array,
}

export default function RejectionFiles({fileRejections}) {
  const {translate} = useLocales()
  const getError = useCallback((error) => {
    // File type must be TYPE
    // File is larger than BYTES
    // File is smaller than BYTES
    // Too many files
    const getSize = () => fData(extractIntegers(error))
    if (error.includes('File type must be')) {
      const fileType = error.replace('File type must be').trim()
      return translate('file_rejections.must_be').replace('{type}', fileType)
    }
    if (error.includes('File is larger than')) {
      return translate('file_rejections.larger_than').replace('{size}', getSize())
    }
    if (error.includes('File is smaller than')) {
      return translate('file_rejections.smaller_than').replace('{size}', getSize())
    }
    if (error.includes('Too many files')) {
      return translate('file_rejections.many_files')
    }
    return error
  }, [])
  if (!fileRejections.length) {
    return null
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        borderColor: (theme) => alpha(theme.palette.error.main, 0.24),
      }}
    >
      {fileRejections.map(({file, errors}) => {
        const {path, size} = fileData(file)

        return (
          <Box key={path} sx={{my: 1}}>
            <Typography variant="subtitle2" noWrap>
              {path} - {size ? fData(size) : ''}
            </Typography>

            {errors.map((error) => (
              <Box key={error.code} component="span" sx={{typography: 'caption'}}>
                - {getError(error.message)}
              </Box>
            ))}
          </Box>
        )
      })}
    </Paper>
  )
}
