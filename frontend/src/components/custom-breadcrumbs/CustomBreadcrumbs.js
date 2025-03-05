import PropTypes from 'prop-types'
// @mui
import {Box, Link, Stack, Typography, Breadcrumbs} from '@mui/material'
//
import LinkItem from './LinkItem'
import useWindowDimensions from "../../hooks/useWindowDimensions";

// ----------------------------------------------------------------------

CustomBreadcrumbs.propTypes = {
  sx: PropTypes.object,
  action: PropTypes.node,
  links: PropTypes.array,
  heading: PropTypes.string,
  moreLink: PropTypes.array,
  activeLast: PropTypes.bool,
}

export default function CustomBreadcrumbs({
                                            links,
                                            action,
                                            heading,
                                            moreLink,
                                            activeLast,
                                            sx,
                                            ...other
                                          }) {
  const lastLink = links[links.length - 1].name
  const windowDimensions = useWindowDimensions()
  return (
    <Box sx={{mb: 5, ...sx}}>
      <Stack direction="row" alignItems="center">
        <Box sx={{flexGrow: 1}}>
          {/* HEADING */}
          {heading && (
            <Typography variant="h4" gutterBottom>
              {heading}
            </Typography>
          )}

          {/* BREADCRUMBS */}
          {!!links.length && (
            <Breadcrumbs separator={<Separator/>} {...other}>
              {links.map((link) => (
                <LinkItem
                  key={link.name || ''}
                  link={link}
                  activeLast={activeLast}
                  disabled={link.name === lastLink}
                />
              ))}
            </Breadcrumbs>
          )}
        </Box>
        {windowDimensions.width > 670 &&
          <Box>
            {action && <Box sx={{flexShrink: 0}}> {action} </Box>}
          </Box>
        }
      </Stack>
      {windowDimensions.width < 670 &&
        <Box sx={{mt: 2}}>
          {action && <Box sx={{flexShrink: 0}}> {action} </Box>}
        </Box>
      }
      {/* MORE LINK */}
      {!!moreLink && (
        <Box sx={{mt: 2}}>
          {moreLink.map((href) => (
            <Link
              noWrap
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{display: 'table'}}
            >
              {href}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  )
}

// ----------------------------------------------------------------------

function Separator() {
  return (
    <Box
      component="span"
      sx={{width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled'}}
    />
  )
}
