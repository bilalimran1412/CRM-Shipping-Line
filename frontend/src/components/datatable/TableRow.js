// @mui
import {Checkbox, Collapse, IconButton, TableCell, TableRow as MUITableRow,} from '@mui/material'
import Iconify from "../iconify";
import {useState} from "react";
// ----------------------------------------------------------------------
export default function TableRow({cols, collapse, collapseRender, row, selected, onSelectRow}) {
  const [open, setOpen] = useState(false);
  const collapseCell = (
    <TableCell>
      <IconButton
        size="small"
        color={open ? 'inherit' : 'default'}
        onClick={() => setOpen(!open)}
      >
        <Iconify icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}/>
      </IconButton>
    </TableCell>
  )
  const renderRow = () => {
    try {
      return cols.map(item => {
        return (
          <TableCell padding={item?.checkbox ? "checkbox" : undefined} align={item?.align ? item?.align : "left"}
                     key={item.id}>
            {item?.checkbox &&
              <Checkbox checked={selected} onClick={onSelectRow}/>
            }
            {item?.render?.(row)}
          </TableCell>
        )
      })
    } catch (e) {
      console.log(e)
      return (
        <TableCell>
          Error
        </TableCell>
      )
    }
  }
  if (collapse) {
    return (
      <>
        <MUITableRow hover selected={selected}>
          {collapseCell}
          {renderRow()}
        </MUITableRow>
        <MUITableRow>
          <TableCell sx={{py: 0}} colSpan={99}>
            <Collapse in={open} unmountOnExit>
              {collapseRender?.(row)}
            </Collapse>
          </TableCell>
        </MUITableRow>
      </>
    )
  }
  return (
    <MUITableRow hover selected={selected}>
      {renderRow()}
    </MUITableRow>
  )
}
