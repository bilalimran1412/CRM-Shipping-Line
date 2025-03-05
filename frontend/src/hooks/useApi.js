import {useDispatch, useSelector} from "react-redux"

const useApi = (slice) => {
  const store = useSelector(store => store?.[slice.name])
  const dispatch = useDispatch()
  return {
    isLoading: store.isLoading,
    data: store.data,
    page: store.page,
    error: store.error,
    isFormLoading: store.isFormLoading,
    formData: store.formData,
    formError: store.formError,
    detailLoading: store.detailLoading,
    detail: store.detail,
    detailError: store.detailError,
    isSubmitting: store.isSubmitting,
    submitError: store.submitError,
    isFilterFormLoading: store.isFilterFormLoading,
    filterFormData: store.filterFormData,
    filterFormError: store.filterFormError,
    fetchList: (callback) => dispatch(slice.fetchList(callback)),
    customFetchList: (url, callback) => dispatch(slice.customFetchList(url, callback)),
    fetchForm: (id, callback) => dispatch(slice.fetchForm(id, callback)),
    fetchFilterForm: (callback) => dispatch(slice.fetchFilterForm(callback)),
    fetchDetail: (id, callback) => dispatch(slice.fetchDetail(id, callback)),
    customFetchDetail: (url, callback) => dispatch(slice.customFetchDetail(url, callback)),
    createData: (data, callback) => dispatch(slice.createData(data, callback)),
    deleteData: (id, callback) => dispatch(slice.deleteData(id, callback)),
    updateData: (id, data, callback) => dispatch(slice.updateData(id, data, callback)),
    customDetailPostRequest: (id, url, data, callback) => dispatch(slice.customDetailPostRequest(id, url, data, callback)),
    customPostRequest: (url, data, callback) => dispatch(slice.customPostRequest(url, data, callback)),
    customDetailGetRequest: (id, url, callback) => dispatch(slice.customDetailGetRequest(id, url, callback)),
    customGetRequest: (url, callback) => dispatch(slice.customGetRequest(url, callback)),
    clearFormData: () => dispatch(slice.actions.setFormData(null)),
    clearDetailData: () => dispatch(slice.actions.setDetail(null)),
    actions: {
      setLoading: slice.actions.setLoading,
      setFormLoading: slice.actions.setFormLoading,
      setFilterFormLoading: slice.actions.setFilterFormLoading,
      setFilterFormData: slice.actions.setFilterFormData,
      setFilterFormError: slice.actions.setFilterFormError,
      setFormData: slice.actions.setFormData,
      setFormError: slice.actions.setFormError,
      setError: slice.actions.setError,
      setData: slice.actions.setData,
      setDetailLoading: slice.actions.setDetailLoading,
      setDetail: slice.actions.setDetail,
      setDetailError: slice.actions.setDetailError,
      setSubmitError: slice.actions.setSubmitError,
      setSubmitLoading: slice.actions.setSubmitLoading,
    },
    dispatch,
  }
}

export default useApi