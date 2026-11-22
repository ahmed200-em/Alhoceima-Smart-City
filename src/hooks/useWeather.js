import { useEffect, useState } from 'react'
import { fetchWeather } from '../services/weather.js'

export default function useWeather() {
  const [state, setState] = useState({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 8000)
    let active = true

    fetchWeather(controller.signal)
      .then((weather) => {
        if (active) setState({ status: 'success', weather })
      })
      .catch(() => {
        if (active) setState({ status: 'error' })
      })
      .finally(() => window.clearTimeout(timeout))

    return () => {
      active = false
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [attempt])

  function retry() {
    setState({ status: 'loading' })
    setAttempt((previous) => previous + 1)
  }

  return { ...state, retry }
}
