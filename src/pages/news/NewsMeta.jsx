import './NewsMeta.css'

const longDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' })
const shortMonth = new Intl.DateTimeFormat('fr-FR', { month: 'short', timeZone: 'UTC' })

const badgeColors = { Actualité: 'blue', Information: 'teal', Alerte: 'amber', Événement: 'teal' }

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

export function formatNewsTime(time) {
  return time.replace(':', ' h ')
}
