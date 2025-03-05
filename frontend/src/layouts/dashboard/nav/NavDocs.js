// @mui
import { Stack, Button, Typography, Box } from '@mui/material'
// auth
import { useAuthContext } from '../../../auth/useAuthContext'
// locales
import { useLocales } from '../../../locales'

// ----------------------------------------------------------------------

export default function NavDocs() {
  const { user } = useAuthContext()

  const { translate } = useLocales()

  return (
    <Stack
      spacing={3}
      sx={{
        px: 5,
        pb: 5,
        mt: 10,
        width: 1,
        display: 'block',
        textAlign: 'center',
      }}
    >
      <Box component="img" src="/assets/illustrations/illustration_docs.svg" />

      <div>
        <Typography gutterBottom variant="subtitle1">
          {`${translate('docs.hi')}, ${user?.first_name}`}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
          {`${translate('docs.description')}`}
        </Typography>
      </div>

      <Button variant="contained">{`${translate('docs.documentation')}`}</Button>
    </Stack>
  )
}
