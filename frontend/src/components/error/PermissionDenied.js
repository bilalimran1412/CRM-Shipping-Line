import {m} from 'framer-motion'
// @mui
import {Container, Typography} from '@mui/material'
// components
import {MotionContainer, varBounce} from 'components/animate'
// assets
import {ForbiddenIllustration} from 'assets/illustrations'
import {useLocales} from "../../locales";
//

export default function PermissionDenied() {
  const {translate} = useLocales()
  return (
    <Container component={MotionContainer} sx={{textAlign: 'center'}}>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" paragraph>
          {translate('error.permission_denied.title')}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{color: 'text.secondary'}}>
          {translate('error.permission_denied.description')}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <ForbiddenIllustration sx={{height: 260, my: {xs: 5, sm: 10}}}/>
      </m.div>
    </Container>
  )
}
