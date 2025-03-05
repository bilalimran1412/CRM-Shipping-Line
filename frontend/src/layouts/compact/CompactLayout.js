import { Outlet } from 'react-router-dom'
// @mui
import { Stack, Container } from '@mui/material'
// hooks
import useOffSetTop from '../../hooks/useOffSetTop'
// config
import { HEADER } from '../../config-global'
//
import Header from './Header'
import {tr} from "date-fns/locale"

// ----------------------------------------------------------------------

export default function CompactLayout({fullHeight=true}) {
  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP)

  return (
    <>
      <Header isOffset={isOffset} />

      <Container component="main">
        <Stack
          sx={{
            py: 12,
            m: 'auto',
            maxWidth: 400,
            minHeight: fullHeight ? '100vh' : 'none',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <Outlet />
        </Stack>
      </Container>
    </>
  )
}
