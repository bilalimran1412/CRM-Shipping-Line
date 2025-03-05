import {m} from 'framer-motion'
// @mui
import {Container, Typography} from '@mui/material'
// components
import {MotionContainer, varBounce} from 'components/animate'
// assets
import {SeverErrorIllustration} from 'assets/illustrations'
import {useLocales} from "../../locales";
//

export default function BadRequest() {
  const {translate} = useLocales()
  return (
    <Container component={MotionContainer} sx={{textAlign: 'center'}}>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" paragraph>
          {translate('error.bad_request.title')}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{color: 'text.secondary'}}>
          {translate('error.bad_request.description')}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <SeverErrorIllustration sx={{height: 260, my: {xs: 5, sm: 10}}}/>
      </m.div>
    </Container>
  )
}
