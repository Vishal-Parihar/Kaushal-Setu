import { useState, useEffect, useCallback } from 'react'
import API from '../utils/api'

const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async (overrideUrl) => {
    setLoading(true)
    setError(null)
    try {
      const res = await API.get(overrideUrl || url)
      setData(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }, [url])

  useEffect(() => { if (url) fetch() }, [url, fetch])

  return { data, loading, error, refetch: fetch }
}

export default useFetch
