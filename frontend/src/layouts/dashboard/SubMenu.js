import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
// @mui
import { useTheme } from '@mui/material/styles'
import { Box, Typography, Avatar, Grid } from '@mui/material'
// config
import { HEADER, NAV } from '../../config-global'
// utils
import { bgBlur } from '../../utils/cssStyles'
import useResponsive from '../../hooks/useResponsive'
import useOffSetTop from '../../hooks/useOffSetTop'
// import { formatTitle } from '../../utils/formatTitle'

// ----------------------------------------------------------------------

SubMenu.propTypes = {
  items: PropTypes.array,
}

export default function SubMenu({ items }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const isDesktop = useResponsive('up', 'lg')
  const isOffset = useOffSetTop(HEADER.H_DASHBOARD_DESKTOP)
  const [activeItem, setActiveItem] = useState(null)

  const handleSubMenuClick = (path) => {
    setActiveItem(path)
    navigate(path)
  }

  return (
    <Box
      sx={{
        boxShadow: 'none',
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        bgcolor: 'background.default',
        borderBottom: `dashed 1px ${theme.palette.divider}`,
        p: 2,
      }}
    >
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={item.title}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                border: '1px solid',
                borderColor: 'primary.main',
                borderRadius: 1,
                boxShadow: theme.shadows[1],
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'primary.main',
                  borderColor: 'primary.main',
                  color: 'white',
                  '& .MuiTypography-root': {
                    color: 'white',
                  },
                },
                '&.active': {
                  bgcolor: 'primary.main',
                  borderColor: 'primary.main',
                  color: 'white',
                  '& .MuiTypography-root': {
                    color: 'white',
                  },
                },
              }}
              className={activeItem === item.path ? 'active' : ''}
              onClick={() => handleSubMenuClick(item.path)}
            >
              <Avatar src={item.icon} sx={{ mb: 1, width: 56, height: 56 }} />
              <Typography variant="subtitle2">{(item.title)}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
