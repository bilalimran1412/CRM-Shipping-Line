// @mui
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Link,
} from '@mui/material';
// hooks
import useResponsive from 'hooks/useResponsive';
// utils
import {fData} from 'utils/formatNumber';
// components
import FileThumbnail from 'components/file-thumbnail';
import Iconify from "components/iconify";
//

// ----------------------------------------------------------------------

export default function DocumentItem({file, sx, ...other}) {
  const isDesktop = useResponsive('up', 'sm');

  return (
    <>
      <Stack
        spacing={isDesktop ? 1.5 : 2}
        direction={isDesktop ? 'row' : 'column'}
        alignItems={isDesktop ? 'center' : 'flex-start'}
        sx={{
          mb: 1,
          p: 2.5,
          borderRadius: 2,
          position: 'relative',
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          '&:hover': {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          },
          ...(isDesktop && {
            p: 1.5,
            borderRadius: 1.5,
          }),
          ...sx,
        }}
        {...other}
      >
        <FileThumbnail file={file.file.file}/>

        <Stack
          sx={{
            width: 1,
            flexGrow: {sm: 1},
            minWidth: {sm: '1px'},
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {file.name}
          </Typography>

          <Stack
            spacing={0.75}
            direction="row"
            alignItems="center"
            sx={{typography: 'caption', color: 'text.disabled', mt: 0.5}}
          >
            <Box> {fData(file.file.file_size)} </Box>

            <Box sx={{width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor'}}/>

            <Box> {file.file.name} </Box>
          </Stack>
        </Stack>


        <Box
          sx={{
            top: 8,
            right: 8,
            flexShrink: 0,
            position: 'absolute',
            ...(isDesktop && {
              position: 'unset',
            }),
          }}
        >
          <Link href={file.file.file} target="_blank">
            <IconButton edge="end" size={'small'}>
              <Iconify icon={'ph:link'}/>
            </IconButton>
          </Link>
        </Box>
      </Stack>


    </>
  );
}
