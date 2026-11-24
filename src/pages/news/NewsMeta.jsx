import './NewsMeta.css'

const longDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' })
const shortMonth = new Intl.DateTimeFormat('fr-FR', { month: 'short', timeZone: 'UTC' })
const cityDate = new Intl.DateTimeFormat('fr-CA', { timeZone: 'Africa/Casablanca', dateStyle: 'short' })

const badgeColors = {
  Actualité: 'blue', Information: 'teal', Alerte: 'amber',
  'À venir': 'teal', 'En cours': 'blue', Terminé: 'slate',
}

export function NewsBadge({ label }) {
  return <span className={`news-badge news-badge--${badgeColors[label]}`}>{label}</span>
}

export function NewsDateTile({ date }) {
  const month = shortMonth.format(new Date(date)).replace('.', '')

  return (
    <time className="news-date-tile" dateTime={date} aria-label={formatNewsDate(date)}>
      <strong>{date.slice(8)}</strong>
      <span>{month}</span>
    </time>
  )
}

export function formatNewsDate(date) {
  return longDate.format(new Date(date))
}

export function formatEventDates({ date, endDate }) {
  if (!endDate || date === endDate) return formatNewsDate(date)
  return longDate.formatRange(new Date(date), new Date(endDate))
}

export function getCityDate() {
  return cityDate.format(new Date())
}

export function getEventStatus({ date, endDate }, today = getCityDate()) {
  if (date > today) return 'À venir'
  return (endDate || date) < today ? 'Terminé' : 'En cours'
}

export function formatNewsTime(time) {
  return time.replace(':', ' h ')
}
