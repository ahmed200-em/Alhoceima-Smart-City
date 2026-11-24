import { ArrowRight, CalendarDays, Clock3, MapPin, Newspaper, Search, SearchX } from 'lucide-react'
import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { announcements, events } from '../../data/news.js'
import { formatEventDates, formatNewsDate, getCityDate, getEventStatus, NewsBadge, NewsDateTile } from './NewsMeta.jsx'
import './News.css'

const types = [
  { id: '', label: 'All' },
  { id: 'annonces', label: 'Announcements' },
  { id: 'evenements', label: 'Events' },
]

function normalize(text) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

function NewsCard({ item, today }) {
  const isEvent = item.type === 'event'

  return (
    <Link className="panel news-card" to={`/actualites/${item.slug}`} aria-labelledby={`news-${item.slug}`}>
      <div className="news-card-image">
        <img src={item.image} alt={item.imageAlt} style={{ objectPosition: item.imagePosition }} loading="lazy" decoding="async" width="640" height="360" />
        {isEvent && <NewsDateTile date={item.date} />}
        {item.photo.illustrative && <span className="news-photo-label">Illustrative photo</span>}
      </div>
      <div className="news-card-body">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <NewsBadge label={isEvent ? getEventStatus(item, today) : item.label} />
          {isEvent ? (
            <span className="news-meta">{formatEventDates(item)}</span>
          ) : (
            <time className="news-meta" dateTime={item.date}>{formatNewsDate(item.date)}</time>
          )}
        </div>
        <h3 id={`news-${item.slug}`}>{item.title}</h3>
        {isEvent && (
          <p className="news-meta flex flex-wrap items-center gap-x-3 gap-y-1">
            {item.time && <span><Clock3 size={14} aria-hidden="true" /> <time dateTime={item.time}>{item.time}</time></span>}
            <span><MapPin size={14} aria-hidden="true" /> {item.location}</span>
          </p>
        )}
        <p className="muted">{item.summary}</p>
        <span className="news-card-link">{isEvent ? 'View event' : 'Read announcement'} <ArrowRight size={16} aria-hidden="true" /></span>
      </div>
    </Link>
  )
}

export default function News() {
  const [params, setParams] = useSearchParams()
  const searchRef = useRef(null)
  const selected = types.find(({ id }) => id === params.get('type'))?.id || ''
  const query = params.get('q') || ''
  const sorting = params.get('ordre')
  const order = sorting === 'croissant' || sorting === 'decroissant' ? sorting : ''
  const keywords = normalize(query).split(/\s+/)
  const today = getCityDate()

  function updateFilter(name, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(name, value)
    else next.delete(name)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  function resetFilters() {
    setParams({}, { replace: true, preventScrollReset: true })
    searchRef.current?.focus()
  }

  function getEntries(entries, show, defaultOrder) {
    if (!show) return []

    const filtered = entries.filter((item) => {
      const text = normalize(`${item.title} ${item.summary} ${item.label} ${item.location || ''}`)
      return keywords.every((word) => text.includes(word))
    })
    const ascending = (order || defaultOrder) === 'croissant'
    return filtered.sort((left, right) => ascending ? left.date.localeCompare(right.date) : right.date.localeCompare(left.date))
  }

  const sections = [
    { id: 'annonces', title: 'Latest announcements', icon: Newspaper, entries: getEntries(announcements, selected !== 'evenements', 'decroissant') },
    { id: 'evenements', title: 'Local events', icon: CalendarDays, entries: getEntries(events, selected !== 'annonces', 'decroissant') },
  ].filter(({ entries }) => entries.length > 0)
  const count = sections.reduce((total, section) => total + section.entries.length, 0)

  return (
    <div className="page-shell news-page">
      <header className="mb-6">
        <h1 className="page-title">News &amp; events</h1>
        <p className="muted mt-2">Find local news and events in Al Hoceima. Each listing includes a source and photo credit.</p>
      </header>

      <section className="news-filters" aria-label="Search and filter posts">
        <div className="news-tabs" role="group" aria-label="Post type">
          {types.map(({ id, label }) => (
            <button type="button" key={id} aria-pressed={id === selected} onClick={() => updateFilter('type', id)}>{label}</button>
          ))}
        </div>
        <div className="news-filter-row">
          <div className="news-search">
            <label className="sr-only" htmlFor="news-search">Search announcements or events</label>
            <input
              className="field-control"
              id="news-search"
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => updateFilter('q', event.target.value)}
              placeholder="Search announcements or events…"
            />
            <Search size={19} aria-hidden="true" />
          </div>
          <label className="sr-only" htmlFor="news-sort">Sort by date</label>
          <select className="field-control" id="news-sort" value={order} onChange={(event) => updateFilter('ordre', event.target.value)}>
            <option value="">Default order</option>
            <option value="croissant">Oldest first</option>
            <option value="decroissant">Newest first</option>
          </select>
        </div>
      </section>

      <p className="news-results" role="status">
        {count} {count === 1 ? 'post' : 'posts'}
      </p>

      {sections.map(({ id, title, icon: Icon, entries }) => (
        <section className="news-section" aria-labelledby={`news-section-${id}`} key={id}>
          <h2 id={`news-section-${id}`}><Icon size={20} aria-hidden="true" /> {title}</h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
            {entries.map((item) => <li key={item.slug} data-reveal><NewsCard item={item} today={today} /></li>)}
          </ul>
        </section>
      ))}

      {count === 0 && (
        <div className="panel news-empty">
          <SearchX size={32} aria-hidden="true" />
          <h2>No posts found</h2>
          <p className="muted">Try another search or view all posts.</p>
          <button className="button button-secondary" type="button" onClick={resetFilters}>View all posts</button>
        </div>
      )}
    </div>
  )
}
