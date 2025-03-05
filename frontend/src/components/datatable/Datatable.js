import {paramCase} from 'change-case'
import {useEffect, useState} from 'react'
import {useNavigate, useSearchParams} from 'react-router-dom'
// @mui
import {
  Card,
  Table,
  Button,
  TableBody,
  TableContainer, CircularProgress,
} from '@mui/material'
// routes
import {PATH_DASHBOARD} from 'routes/paths'
// components
import Scrollbar from 'components/scrollbar'
import ConfirmDialog from 'components/confirm-dialog'
import {useSettingsContext} from 'components/settings'
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'components/table'
import TableRow from "./TableRow"
import {useLocales} from "locales"
// sections
import './assets/style.scss'
import Error from "../error";
// ----------------------------------------------------------------------

export default function Datatable({
                                    loading,
                                    collapse,
                                    collapseRender,
                                    data,
                                    page,
                                    filters,
                                    actions,
                                    cols,
                                    error,
                                    onReload
                                  }) {
  const {
    dense,
    order,
    orderBy,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultDense: true
  })
  const {themeMode} = useSettingsContext()
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()


  const isNotFound = data?.length === 0

  useEffect(() => {
    setSelected([])
  }, [searchParams])
  return (
    <Card className={'relative-block'}>
      {error &&
        <div className='loading-block error-block'>
          <Error code={error?.status || 'load'} reload={onReload}/>
        </div>
      }
      {filters}

      <TableContainer className={'relative-block'}>
        <TableSelectedAction
          dense={dense}
          numSelected={selected.length}
          rowCount={data?.length}
          onSelectAllRows={(checked) =>
            onSelectAllRows(
              checked,
              data.map((row) => row.id)
            )
          }
          action={actions?.(selected)}
        />
        {loading &&
          <div className='loading-block'>
            <CircularProgress color="primary"/>
          </div>
        }
        <Scrollbar>
          <Table size={dense ? 'small' : 'medium'} sx={{minWidth: 800}} className={'datatable'}>
            <TableHeadCustom
              collapse={collapse}
              order={order}
              orderBy={orderBy}
              headLabel={cols}
              rowCount={data?.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  data?.map((row) => row.id)
                )
              }
            />

            <TableBody className={themeMode === 'dark' ? 'dark' : 'light'}>
              {data.map((row) => (
                <TableRow
                  collapse={collapse}
                  collapseRender={collapseRender}
                  cols={cols}
                  key={row.id}
                  row={row}
                  selected={selected.includes(row.id)}
                  onSelectRow={() => onSelectRow(row.id)}
                />
              ))}
              <TableNoData isNotFound={isNotFound}/>
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      <TablePaginationCustom
        page={page}
        rowsPerPage={page?.size}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        dense={dense}
        onChangeDense={onChangeDense}
      />
    </Card>
  )
}
