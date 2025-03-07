import { useState } from 'react'
import { Outlet } from 'react-router-dom'
// @mui
import { Box } from '@mui/material'
// hooks
import useResponsive from '../../hooks/useResponsive'
// components
import { useSettingsContext } from '../../components/settings'
//
import Main from './Main'
import Header from './header'
import NavMini from './nav/NavMini'
import NavVertical from './nav/NavVertical'
import NavHorizontal from './nav/NavHorizontal'
import SubMenu from './SubMenu'

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { themeLayout } = useSettingsContext()

  const isDesktop = useResponsive('up', 'lg')

  const [open, setOpen] = useState(false)
  const [selectedSubMenu, setSelectedSubMenu] = useState([])

  const isNavHorizontal = themeLayout === 'horizontal'

  const isNavMini = themeLayout === 'mini'

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubMenuSelect = (subMenu) => {
    setSelectedSubMenu(subMenu)
  }

  const renderNavVertical = <NavVertical openNav={open} onCloseNav={handleClose} onSubMenuSelect={handleSubMenuSelect} />

  if (isNavHorizontal) {
    return (
      <>
        <Header onOpenNav={handleOpen} />

        {isDesktop ? <NavHorizontal /> : renderNavVertical}


        <Main>
          <SubMenu items={selectedSubMenu} />
          <Outlet />
        </Main>
      </>
    )
  }

  if (isNavMini) {
    return (
      <>
        <Header onOpenNav={handleOpen} />

        <Box
          sx={{
            display: { lg: 'flex' },
            minHeight: { lg: 1 },
          }}
        >
          {isDesktop ? <NavMini /> : renderNavVertical}

          <Main>
            <SubMenu items={selectedSubMenu} />
            <Outlet />
          </Main>
        </Box>
      </>
    )
  }

  return (
    <>
      <Header onOpenNav={handleOpen} />

      <Box
        sx={{
          display: { lg: 'flex' },
          minHeight: { lg: 1 },
        }}
      >
        {renderNavVertical}

        <Main>
          <SubMenu items={selectedSubMenu} />
          <Outlet />
        </Main>
      </Box>
    </>
  )
}
