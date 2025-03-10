import { useState } from 'react'
//
import SvgColor from '../../svg-color'
import { StyledCard } from '../styles'
import {useLocales} from "../../../locales";

// ----------------------------------------------------------------------

export default function FullScreenOptions() {
  const [fullscreen, setFullscreen] = useState(false)
  const {translate} = useLocales()
  const onToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setFullscreen(true)
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  return (
    <StyledCard
      selected={fullscreen}
      onClick={onToggleFullScreen}
      sx={{
        height: 48,
        typography: 'subtitle2',
        '& .svg-color': {
          ml: 1,
          width: 16,
          height: 16,
        },
      }}
    >
      {fullscreen ? translate('configurator.exit_fullscreen') : translate('configurator.fullscreen')}

      <SvgColor
        src={`/assets/icons/setting/${fullscreen ? 'ic_exit_full_screen' : 'ic_full_screen'}.svg`}
      />
    </StyledCard>
  )
}
