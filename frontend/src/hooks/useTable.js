import {useState, useCallback, useEffect} from 'react'
import {useSearchParams} from "react-router-dom"
import {getCurrentUrlParam} from "../utils"
import useWatchSearchParams from "./useWatchSearchParams"

// ----------------------------------------------------------------------

export default function useTable(props) {
  const [dense, setDense] = useState(!!props?.defaultDense)

  const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || '')

  const [order, setOrder] = useState(props?.defaultOrder || 'asc')

  const [page, setPage] = useState(props?.defaultCurrentPage || 0)

  const [rowsPerPage, setRowsPerPage] = useState(props?.defaultRowsPerPage || 5)

  const [selected, setSelected] = useState(props?.defaultSelected || [])
  const [searchParams, setSearchParams] = useSearchParams()
  const onSort = useCallback(
    (id) => {
      const isAsc = orderBy === id && order === 'asc'
      const isDesc = orderBy === id && order === 'desc'

      if (id !== '') {
        const params = getCurrentUrlParam()

        if (isAsc) {
          // Switch to descending
          params.set('ordering', `-${id}`)
          setSearchParams(params)
          setOrder('desc')
        } else if (isDesc) {
          // Unset sorting
          params.delete('ordering')
          setSearchParams(params)
          setOrder(null)
          setOrderBy(null)
        } else {
          // Set to ascending
          params.set('ordering', id)
          setSearchParams(params)
          setOrder('asc')
          setOrderBy(id)
        }
      }
    },
    [order, orderBy]
  )

  const onSelectRow = useCallback(
    (id) => {
      const selectedIndex = selected.indexOf(id)

      let newSelected = []

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id)
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1))
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1))
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        )
      }
      setSelected(newSelected)
    },
    [selected]
  )

  const onSelectAllRows = useCallback((checked, newSelecteds) => {
    if (checked) {
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }, [])

  const onChangePage = useCallback((newPage) => {
    const params = getCurrentUrlParam()
    params.set('page', newPage)
    setSearchParams(params)
  }, [])

  const onChangeRowsPerPage = useCallback((event) => {
    const value = event.target.value
    setRowsPerPage(value)
    const params = getCurrentUrlParam()
    params.delete('page')
    params.set('page_size', event.target.value)
    setSearchParams(params)
  }, [])

  const onChangeDense = useCallback((event) => {
    setDense(event.target.checked)
  }, [])

  const setOrdering = useCallback((ordering) => {

  }, [])

  useEffect(() => {
    const ordering = searchParams.get('ordering')
    setOrdering(ordering)
    if (ordering && ordering.startsWith('-')) {
      setOrderBy(ordering.substring(1))
      setOrder('desc')
    } else {
      setOrderBy(ordering)
      setOrder('asc')
    }
  }, [searchParams])
  return {
    dense,
    order,
    page,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeDense,
    onChangeRowsPerPage,
    //
    setPage,
    setDense,
    setOrder,
    setOrderBy,
    setSelected,
    setRowsPerPage,
  }
}
