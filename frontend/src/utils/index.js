export const getCurrentUrlParamString = () => {
  const params = new URLSearchParams(document.location.search).toString()
  if (params) {
    return `?${params}`
  }
  return ''
}

export const getCurrentUrlParamJSON = () => {
  const params = getCurrentUrlParamObject()
  const newParams = new URLSearchParams()
  newParams.set('params', JSON.stringify(params))
  if (Object.keys(params).length > 0) {
    return `?${newParams.toString()}`
  }
  return ''
}
export const searchParamsFromJSON = (searchParams) => {
  const params = searchParams?.get('params')
  if (params) {
    const newParams = new URLSearchParams(JSON.parse(params))
    return `?${newParams.toString()}`
  }
  return ''
}

export const getCurrentUrlParam = () => {
  return new URLSearchParams(document.location.search)
}
export const getCurrentUrlParamObject = () => {
  return Object.fromEntries(new URLSearchParams(document.location.search))
}
export const setCurrentUrlParam = (name, value) => {
  const currentParam = new URLSearchParams(document.location.search)
  if (!value) {
    currentParam.delete(name)
  } else {
    currentParam.set(name, value)
  }
  return currentParam
}

export const truncateText = (text, maxLength) => {
  // Check if the text length is greater than the maximum allowed length
  if (text.length > maxLength) {
    // Truncate the text and add "..."
    return text.substring(0, maxLength - 3) + "..."
  }
  // If the text length is within the limit, return it as is
  return text
}

export const formatNumber = (number) => {
  return number
}

export const convertNewlinesToBreaks = (text) => {
  return text.split('\n').map((line, index) => (
    <div key={index}>
      {line}
      {index < text.split('\n').length - 1 && <br/>}
    </div>
  ));
}
