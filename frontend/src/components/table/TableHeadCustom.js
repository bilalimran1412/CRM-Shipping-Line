import PropTypes from 'prop-types'
// @mui
import {Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel} from '@mui/material'

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
}

// ----------------------------------------------------------------------

TableHeadCustom.propTypes = {
  sx: PropTypes.object,
  onSort: PropTypes.func,
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  rowCount: PropTypes.number,
  numSelected: PropTypes.number,
  onSelectAllRows: PropTypes.func,
  order: PropTypes.oneOf(['asc', 'desc']),
}

export default function TableHeadCustom({
                                          collapse,
                                          order,
                                          orderBy,
                                          rowCount = 0,
                                          headLabel,
                                          numSelected = 0,
                                          onSort,
                                          onSelectAllRows,
                                          sx,
                                        }) {
  return (
    <TableHead sx={sx}>
      <TableRow>
        {
          collapse && <TableCell padding="checkbox"/>
        }
        {headLabel.map((headCell) => {
          if (headCell.checkbox) {
            return (
              <TableCell padding="checkbox" key={headCell.id}>
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={(event) => onSelectAllRows?.(event.target.checked)}
                />
              </TableCell>
            )
          }

          return (
            <TableCell
              key={headCell.id}
              align={headCell.align || 'left'}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{width: headCell.width, minWidth: headCell.minWidth}}
            >
              {(headCell.sort && onSort) ? (
                <TableSortLabel
                  hideSortIcon
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={() => onSort(headCell.id)}
                  sx={{textTransform: 'capitalize'}}
                >
                  {headCell.label}

                  {orderBy === headCell.id ? (
                    <Box sx={{...visuallyHidden}}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              ) : (
                headCell.label
              )}
            </TableCell>
          )
        })}
      </TableRow>
    </TableHead>
  )
}
