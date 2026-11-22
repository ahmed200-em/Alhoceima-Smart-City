import { Cloud, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSnow, CloudSun, LoaderCircle, Moon, RefreshCw, Sun } from 'lucide-react'
import useWeather from '../hooks/useWeather.js'
import './WeatherCard.css'

function condition({ code, isDay }) {
  if (code === 0) return isDay ? [Sun, 'Ciel dégagé'] : [Moon, 'Nuit claire']
  if (code <= 2) return [isDay ? CloudSun : CloudMoon, 'Partiellement nuageux']
  if (code === 3) return [Cloud, 'Couvert']
  if (code === 45 || code === 48) return [CloudFog, 'Brouillard']
  if (code >= 95) return [CloudLightning, 'Orages']
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return [CloudSnow, 'Neige']
  if (code >= 51 && code <= 82) return [CloudRain, 'Pluie']
  return [Cloud, 'Conditions inconnues']
}

export default function WeatherCard() {
  const { status, weather, retry } = useWeather()
  const [WeatherIcon, label] = weather ? condition(weather) : [CloudSun, '']
  const Icon = status === 'loading' ? LoaderCircle : WeatherIcon

  return (
    <aside className="weather-card" aria-label="Météo à Al Hoceima">
      <span className="weather-icon">
        <Icon size={25} className={status === 'loading' ? 'animate-spin motion-reduce:animate-none' : ''} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="weather-title">Météo à Al Hoceima</p>
        <div aria-live="polite" aria-atomic="true">
          {status === 'loading' && <p className="weather-detail">Chargement…</p>}
          {status === 'error' && <p className="weather-detail">Météo indisponible</p>}
          {weather && (
            <p className="weather-detail"><strong>{weather.temperature} °C</strong> <span>·</span> {label}</p>
          )}
        </div>
      </div>
      {status === 'error' && (
        <button className="weather-retry" type="button" onClick={retry}>
          <RefreshCw size={14} aria-hidden="true" /> Réessayer
        </button>
      )}
    </aside>
  )
}
