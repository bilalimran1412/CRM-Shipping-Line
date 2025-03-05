import PropTypes from 'prop-types'
// @mui
import { TableRow, TableCell } from '@mui/material'
//
import EmptyContent from '../empty-content'
import {useLocales} from "../../locales"

// ----------------------------------------------------------------------

TableNoData.propTypes = {
  isNotFound: PropTypes.bool,
}

export default function TableNoData({ isNotFound }) {
  const {translate} = useLocales()
  return (
    <TableRow>
      {isNotFound ? (
        <TableCell colSpan={12}>
          <EmptyContent
            title={translate("no_data")}
            sx={{
              '& span.MuiBox-root': { height: 160 },
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  )
}
