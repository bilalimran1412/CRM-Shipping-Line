import PropTypes from 'prop-types'
import {forwardRef} from 'react'
import {Link as RouterLink} from 'react-router-dom'
// @mui
import {Tooltip, Link, ListItemText} from '@mui/material'
// locales
import {useLocales} from '../../../locales'
// auth
import RoleBasedGuard from '../../../auth/RoleBasedGuard'
//
import Iconify from '../../iconify'
import {StyledItem, StyledIcon} from './styles'

// ----------------------------------------------------------------------

const NavItem = forwardRef(({item, depth, open, active, isExternalLink, ...other}, ref) => {
  const {translate} = useLocales()

  const {title, path, icon, children, disabled, caption, roles, permission} = item

  if (typeof permission === 'boolean' && permission === false) return null
  const subItem = depth !== 1

  const renderContent = (
    <StyledItem ref={ref} open={open} depth={depth} active={active} disabled={disabled} {...other}>
      {icon && <StyledIcon>{icon}</StyledIcon>}

      <ListItemText
        primary={`${translate(title)}`}
        primaryTypographyProps={{
          noWrap: true,
          sx: {
            width: 120,
            fontSize: 10,
            lineHeight: '16px',
            textAlign: 'center',
            ...(active && {
              fontWeight: 'fontWeightMedium',
            }),
            ...(subItem && {
              fontSize: 14,
              width: 'auto',
              textAlign: 'left',
            }),
          },
        }}
      />

      {caption && (
        <Tooltip title={`${translate(caption)}`} arrow placement="right">
          <Iconify
            icon="eva:info-outline"
            width={16}
            sx={{
              top: 11,
              left: 6,
              position: 'absolute',
            }}
          />
        </Tooltip>
      )}

      {!!children && (
        <Iconify
          width={16}
          icon="eva:chevron-right-fill"
          sx={{
            top: icon ? 11 : 0,
            right: 6,
            position: 'absolute',
          }}
        />
      )}
    </StyledItem>
  )

  const renderItem = () => {
    if (Array.isArray(item.children) && item.children.length !== 0) {
      return renderContent
    }
    // ExternalLink
    if (isExternalLink)
      return (
        <Link href={path} target="_blank" rel="noopener" underline="none">
          {renderContent}
        </Link>
      )

    // Default
    return (
      <Link component={RouterLink} to={path} underline="none">
        {renderContent}
      </Link>
    )
  }

  return <RoleBasedGuard roles={roles}> {renderItem()} </RoleBasedGuard>
})

NavItem.propTypes = {
  open: PropTypes.bool,
  active: PropTypes.bool,
  item: PropTypes.object,
  depth: PropTypes.number,
  isExternalLink: PropTypes.bool,
}

export default NavItem
