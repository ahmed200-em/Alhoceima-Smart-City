const parameters = new URLSearchParams({
  latitude: '35.25',
  longitude: '-3.93',
  current: 'temperature_2m,weather_code,is_day',
  timezone: 'Africa/Casablanca',
  forecast_days: '1',
})

export async function fetchWeather(signal) {
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${parameters}`, { signal })
  if (!response.ok) throw new Error(`Open-Meteo a répondu avec le code ${response.status}`)

  const { current } = await response.json()
  if (!Number.isFinite(current?.temperature_2m) || !Number.isInteger(current?.weather_code)) {
    throw new Error('Réponse météo incomplète')
  }

  return {
    temperature: Math.round(current.temperature_2m),
    code: current.weather_code,
    isDay: current.is_day !== 0,
  }
}
