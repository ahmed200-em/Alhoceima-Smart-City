import { Cloud, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSnow, CloudSun, Moon, RefreshCw, Sun } from 'lucide-react'
import useWeather from '../hooks/useWeather.js'
import LoadingPlaceholder from './LoadingPlaceholder.jsx'
import './WeatherCard.css'

function condition({ code, isDay }) {
  if (code === 0) return isDay ? [Sun, 'Clear skies'] : [Moon, 'Clear night']
  if (code <= 2) return [isDay ? CloudSun : CloudMoon, 'Partly cloudy']
  if (code === 3) return [Cloud, 'Overcast']
  if (code === 45 || code === 48) return [CloudFog, 'Fog']
  if (code >= 95) return [CloudLightning, 'Thunderstorms']
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return [CloudSnow, 'Snow']
  if (code >= 51 && code <= 82) return [CloudRain, 'Rain']
  return [Cloud, 'Unknown conditions']
}

export default function WeatherCard() {
  const { status, weather, retry } = useWeather()
  const [WeatherIcon, label] = weather ? condition(weather) : [CloudSun, '']
  const loading = status === 'loading'

  return (
    <aside className="weather-card" aria-label="Weather in Al Hoceima">
      {loading ? <LoadingPlaceholder className="weather-icon" /> : (
        <span className="weather-icon"><WeatherIcon size={25} aria-hidden="true" /></span>
      )}
      <div className="min-w-0">
        <p className="weather-title">Weather in Al Hoceima</p>
        <div aria-live="polite" aria-atomic="true">
          {loading && (
            <p className="weather-detail weather-loading">
              <span className="sr-only">Loading weather…</span>
              <LoadingPlaceholder className="weather-loading-line" />
            </p>
          )}
          {status === 'error' && <p className="weather-detail">Weather unavailable</p>}
          {weather && (
            <p className="weather-detail"><strong>{weather.temperature} °C</strong> <span>·</span> {label}</p>
          )}
        </div>
      </div>
      {status === 'error' && (
        <button className="weather-retry" type="button" onClick={retry}>
          <RefreshCw size={14} aria-hidden="true" /> Try again
        </button>
      )}
    </aside>
  )
}
