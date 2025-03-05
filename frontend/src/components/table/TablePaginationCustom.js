import PropTypes from 'prop-types'
// @mui
import {
  Box,
  Switch,
  TablePagination,
  FormControlLabel,
  Pagination,
  TextField,
  MenuItem,
  Grid,
  InputAdornment, Tooltip
} from '@mui/material'
import './assets/style.scss'
import {useLocales} from "../../locales"
import Iconify from "../iconify"
// ----------------------------------------------------------------------

TablePaginationCustom.propTypes = {
  dense: PropTypes.bool,
  onChangeDense: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
}

export default function TablePaginationCustom({
                                                dense,
                                                onChangeDense,
                                                onPageChange,
                                                rowsPerPage,
                                                defaultPerPage = 15,
                                                onRowsPerPageChange,
                                                rowsPerPageOptions = [15, 25, 50, 100, 250, 500],
                                                page,
                                                sx,
                                                ...other
                                              }) {
  const {translate} = useLocales()
  return (
    <Box className={'table-footer'} sx={{...sx}}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          {onChangeDense && (
            <FormControlLabel
              label={translate('dense')}
              control={<Switch checked={dense} onChange={onChangeDense}/>}
            />
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          <div className={'pagination'}>
            {((page?.total_pages && page.total_pages !== 1) || rowsPerPage !== defaultPerPage) &&
              <Tooltip title={translate('items_per_page')} placement="left">
                <TextField
                  className={'items-per-page'}
                  variant={'standard'}
                  select
                  value={Number(rowsPerPage || defaultPerPage)}
                  onChange={onRowsPerPageChange}
                >
                  {!rowsPerPageOptions.some(item => item === Number(rowsPerPage || defaultPerPage)) &&
                    <MenuItem value={Number(rowsPerPage || defaultPerPage)}>{rowsPerPage || defaultPerPage} {translate('page_element')}</MenuItem>
                  }
                  {rowsPerPageOptions.map(item => {
                    return <MenuItem value={item} key={`items-${item}`}>{item} {translate('page_element')}</MenuItem>
                  })}
                </TextField>
              </Tooltip>
            }
            {(page?.total_pages && page.total_pages !== 1) &&
              <Pagination
                page={page?.current || 1}
                shape="rounded"
                count={page?.total_pages || 1}
                variant="outlined"
                onChange={(e, page) => onPageChange(page)}
              />
            }
          </div>
        </Grid>
      </Grid>


    </Box>
  )
}
