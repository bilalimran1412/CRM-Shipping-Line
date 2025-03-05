// ** Redux Imports
import {createSlice} from "@reduxjs/toolkit"
import axios from "utils/axios"
import {getCurrentUrlParamString} from "utils"

export const createApiStore = (name, apiLink) => {
  const apiInitial = {
    isLoading: true,
    data: [],
    page: null,
    error: null,

    isFormLoading: false,
    formData: null,
    formError: null,

    isFilterFormLoading: false,
    filterFormData: null,
    filterFormError: null,

    detailLoading: false,
    detail: null,
    detailError: null,

    isSubmitting: false,
    submitError: null,
  }

  const apiSlice = createSlice({
    name: name,
    initialState: apiInitial,
    reducers: {
      setLoading: (state, action) => {
        state.error = null
        state.isLoading = action.payload
      },
      setFormLoading: (state, action) => {
        state.formError = null
        state.isFormLoading = action.payload
      },
      setFilterFormLoading: (state, action) => {
        state.filterFormError = null
        state.isFilterFormLoading = action.payload
      },
      setFilterFormData: (state, action) => {
        state.filterFormData = action.payload
        state.filterFormError = null
        state.isFilterFormLoading = false
      },
      setFilterFormError: (state, action) => {
        state.filterFormData = null
        state.isFilterFormLoading = false
        state.filterFormError = action.payload
      },
      setFormData: (state, action) => {
        state.formData = action.payload
        state.formError = null
        state.isFormLoading = false
      },
      setFormError: (state, action) => {
        state.formData = null
        state.isFormLoading = false
        state.formError = action.payload
      },
      setError: (state, action) => {
        state.error = action.payload
        state.isLoading = false
      },
      setData: (state, action) => {
        if (action.payload?.results && action.payload?.page) {
          state.data = action.payload?.results
          state.page = action.payload?.page
        } else {
          state.data = action.payload
        }
        state.isLoading = false
      },
      setDetailLoading: (state, action) => {
        state.detailError = null
        state.detailLoading = action.payload
      },
      setDetail: (state, action) => {
        state.detail = action.payload
        state.detailLoading = false
      },
      setDetailError: (state, action) => {
        state.detailError = action.payload
        state.detailLoading = false
      },
      setSubmitError: (state, action) => {
        state.submitError = action.payload
      },
      setSubmitLoading: (state, action) => {
        state.isSubmitting = action.payload
      },
    },
  })
  const fetchList = (callback) => {
    return async dispatch => {
      dispatch(apiSlice.actions.setLoading(true))
      try {
        const params = getCurrentUrlParamString()
        const response = await axios.get(`${apiLink}${params}`)
        dispatch(apiSlice.actions.setData(response.data))
        callback?.success?.(response.data)
      } catch (e) {
        callback?.error?.(e)
        dispatch(apiSlice.actions.setError(e))
      }
    }
  }
  const customFetchList = (url, callback) => {
    return async dispatch => {
      dispatch(apiSlice.actions.setLoading(true))
      try {
        const params = getCurrentUrlParamString()
        const response = await axios.get(`${url}${params}`)
        dispatch(apiSlice.actions.setData(response.data))
        callback?.success?.(response.data)
      } catch (e) {
        callback?.error?.(e)
        dispatch(apiSlice.actions.setError(e))
      }
    }
  }
  const fetchForm = (id, callback) => {
    return async dispatch => {
      dispatch(apiSlice.actions.setFormLoading(true))
      try {
        let response
        if (id) {
          response = await axios.get(`${apiLink}${id}/form-data/`)
        } else {
          response = await axios.get(`${apiLink}form-data/`)
        }
        dispatch(apiSlice.actions.setFormData(response.data))
        callback?.success?.(response.data)
      } catch (e) {
        dispatch(apiSlice.actions.setFormError(e))
        callback?.error?.(e)
      }
    }
  }
  const fetchFilterForm = (enableParams = false, callback) => {
    return async dispatch => {
      dispatch(apiSlice.actions.setFilterFormLoading(true))
      try {
        const params = getCurrentUrlParamString()
        const response = await axios.get(`${apiLink}filter-data/${enableParams ? params : ''}`)
        dispatch(apiSlice.actions.setFilterFormData(response.data))
        callback?.success?.(response.data)
      } catch (e) {
        dispatch(apiSlice.actions.setFilterFormError(e))
        callback?.error?.(e)
      }
    }
  }
  const fetchDetail = (id, callback) => {
    return async dispatch => {
      dispatch(apiSlice.actions.setDetailLoading(true))
      try {
        const response = await axios.get(`${apiLink}${id}/`)
        dispatch(apiSlice.actions.setDetail(response.data))
        callback?.success?.(response.data)
      } catch (e) {
        dispatch(apiSlice.actions.setDetailError(e))
        callback?.error?.(e)
      }
    }
  }
  const customFetchDetail = (url, callback) => {
    return async dispatch => {
      dispatch(apiSlice.actions.setDetailLoading(true))
      try {
        const response = await axios.get(`${url}`)
        dispatch(apiSlice.actions.setDetail(response.data))
        callback?.success?.(response.data)
      } catch (e) {
        dispatch(apiSlice.actions.setDetailError(e))
        callback?.error?.(e)
      }
    }
  }
  const createData = (data, callback) => {
    return async dispatch => {
      dispatch(apiSlice.actions.setSubmitLoading(true))
      try {
        const response = await axios.post(`${apiLink}`, data)
        callback?.success?.(response.data)
      } catch (e) {
        dispatch(apiSlice.actions.setSubmitError(e))
        callback?.error?.(e)
      } finally {
        dispatch(apiSlice.actions.setSubmitLoading(false))
      }
    }
  }
  const deleteData = (id, callback) => {
    return async dispatch => {
      dispatch(apiSlice.actions.setSubmitLoading(true))
      try {
        const response = await axios.delete(`${apiLink}${id}/`)
        callback?.success?.(response.data)
      } catch (e) {
        dispatch(apiSlice.actions.setSubmitError(e))
        callback?.error?.(e)
      } finally {
        dispatch(apiSlice.actions.setSubmitLoading(false))
      }
    }
  }
  const updateData = (id, data, callback) => {
    return async dispatch => {
      dispatch(apiSlice.actions.setSubmitLoading(true))
      try {
        const response = await axios.put(`${apiLink}${id}/`, data)
        callback?.success?.(response.data)
      } catch (e) {
        dispatch(apiSlice.actions.setSubmitError(e))
        callback?.error?.(e)
      } finally {
        dispatch(apiSlice.actions.setSubmitLoading(false))
      }
    }
  }
  const customDetailPostRequest = (id, url, data, callback) => {
    return async dispatch => {
      try {
        const response = await axios.post(`${apiLink}${id}/${url}/`, data)
        callback?.success?.(response.data)
      } catch (e) {
        callback?.error?.(e)
        console.log(e)
      } finally {

      }
    }
  }
  const customPostRequest = (url, data, callback) => {
    return async dispatch => {
      try {
        const response = await axios.post(`${apiLink}${url}/`, data)
        callback?.success?.(response.data)
      } catch (e) {
        callback?.error?.(e)
      } finally {

      }
    }
  }
  const customDetailGetRequest = (id, url, callback) => {
    return async dispatch => {
      try {
        const response = await axios.get(`${apiLink}${id}/${url}`)
        callback?.success?.(response.data)
      } catch (e) {
        callback?.error?.(e)
        console.log(e)
      } finally {

      }
    }
  }
  const customGetRequest = (url, callback) => {
    return async dispatch => {
      try {
        const response = await axios.get(`${apiLink}${url}`)
        callback?.success?.(response.data)
      } catch (e) {
        callback?.error?.(e)
        console.log(e)
      } finally {

      }
    }
  }
  return {
    ...apiSlice,
    fetchList,
    customFetchList,
    fetchForm,
    fetchFilterForm,
    fetchDetail,
    customFetchDetail,
    createData,
    deleteData,
    updateData,
    customDetailPostRequest,
    customPostRequest,
    customDetailGetRequest,
    customGetRequest,
    actions: {
      setLoading: apiSlice.actions.setLoading,
      setFormLoading: apiSlice.actions.setFormLoading,
      setFilterFormLoading: apiSlice.actions.setFilterFormLoading,
      setFilterFormData: apiSlice.actions.setFilterFormData,
      setFilterFormError: apiSlice.actions.setFilterFormError,
      setFormData: apiSlice.actions.setFormData,
      setFormError: apiSlice.actions.setFormError,
      setError: apiSlice.actions.setError,
      setData: apiSlice.actions.setData,
      setDetailLoading: apiSlice.actions.setDetailLoading,
      setDetail: apiSlice.actions.setDetail,
      setDetailError: apiSlice.actions.setDetailError,
      setSubmitError: apiSlice.actions.setSubmitError,
      setSubmitLoading: apiSlice.actions.setSubmitLoading,
    }

  }
}
