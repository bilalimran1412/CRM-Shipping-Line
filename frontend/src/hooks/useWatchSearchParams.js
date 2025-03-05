import {useEffect, useState} from 'react'
import {useSearchParams} from 'react-router-dom'

const useWatchSearchParams = () => {
  const [init, setInit] = useState(false)
  const [searchParams] = useSearchParams()
  const [params, setParams] = useState(Object.fromEntries(searchParams.entries()))

  useEffect(() => {
    const handleSearchParamsChange = () => {
      if (init) {
        setParams(Object.fromEntries(searchParams.entries()))
      }
    }

    handleSearchParamsChange() // Initial call to set state on mount

    const observer = new MutationObserver(handleSearchParamsChange)
    const observerConfig = {
      subtree: true,
      childList: true,
    }

    const searchParamsElement = document.querySelector('[data-router-hash]')
    if (searchParamsElement) {
      observer.observe(searchParamsElement, observerConfig)
    }
    return () => {
      if (searchParamsElement) {
        observer.disconnect()
      }
    }
  }, [searchParams])
  useEffect(() => {
    setInit(true)
  }, [])
  return params
}

export default useWatchSearchParams
