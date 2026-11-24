import './NewsMeta.css'

const longDate = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' })
const shortMonth = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' })
const cityDate = new Intl.DateTimeFormat('fr-CA', { timeZone: 'Africa/Casablanca', dateStyle: 'short' })

const badgeColors = {
  News: 'blue', Information: 'teal', Alert: 'amber',
  Upcoming: 'teal', 'In progress': 'blue', Ended: 'slate',
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
  if (date > today) return 'Upcoming'
  return (endDate || date) < today ? 'Ended' : 'In progress'
}
