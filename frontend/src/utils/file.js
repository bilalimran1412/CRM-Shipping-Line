import axios from "./axios";

export const uploadFile = async ({file, type, setUploadState, success, error}) => {
  const config = {
    onUploadProgress: progressEvent => {
      let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setUploadState?.(percentCompleted)
    }
  }
  const data = new FormData()
  data.append('type', type)
  data.append('file', file)

  const API_URL = `${process.env.REACT_APP_HOST_API_KEY}main/file/`
  try {
    const response = await axios.post(API_URL, data, config)
    if (typeof success === 'function') {
      success(response.data)
    }
  } catch (e) {
    if (typeof error === 'function') {
      error(e)
    }
  }
}