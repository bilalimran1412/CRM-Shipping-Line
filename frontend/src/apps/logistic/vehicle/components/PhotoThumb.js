import {m, AnimatePresence} from 'framer-motion'
// @mui
import {alpha} from '@mui/material/styles'
import {Box, IconButton, Stack} from '@mui/material'
//
import Iconify from 'components/iconify'
import {varFade} from "components/animate";
import {fileData} from 'components/file-thumbnail'
import {PhotoModal} from "./PhotoModal";
import {useRef} from "react";
// ----------------------------------------------------------------------

export default function PhotoThumb({files, onRemove, sx}) {
  const photoModalRef = useRef()
  if (!files?.length) {
    return null
  }
  return (
    <AnimatePresence initial={false}>
      <>
        {files.map((file, index) => {
          const {key, name = '', size = 0} = fileData(file)

          const isNotFormatFile = typeof file === 'string'

          return (
            <Stack
              key={file._field_id || file.id}
              component={m.div}
              {...varFade().inUp}
              alignItems="center"
              display="inline-flex"
              justifyContent="center"
              sx={{
                m: 0.5,
                width: 80,
                height: 80,
                borderRadius: 1.25,
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                border: (theme) => `solid 1px ${theme.palette.divider}`,
                ...sx,
              }}
            >
              <Box
                component="img"
                src={file.file.thumb}
                onClick={() => photoModalRef.current.open(index)}
                sx={{
                  width: 1,
                  height: 1,
                  flexShrink: 0,
                  objectFit: 'cover',
                  position: 'absolute'
                }}
              />
              {onRemove && (
                <IconButton
                  size="small"
                  onClick={(e) => onRemove(file, index)}
                  sx={{
                    zIndex: 2,
                    top: 4,
                    right: 4,
                    p: '1px',
                    position: 'absolute',
                    color: (theme) => alpha(theme.palette.common.white, 0.72),
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                    },
                  }}
                >
                  <Iconify icon="eva:close-fill" width={16}/>
                </IconButton>
              )}
            </Stack>
          )

        })}
        <PhotoModal photos={files} ref={photoModalRef}/>
      </>
    </AnimatePresence>
  )
}
