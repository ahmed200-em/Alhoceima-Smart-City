import { ArrowLeft, CalendarDays, ChevronRight, Clock3, MapPin, SearchX } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { announcements, events } from '../../data/news.js'
import { formatEventDates, formatNewsDate, getEventStatus, NewsBadge } from './NewsMeta.jsx'
import './NewsDetails.css'

export default function NewsDetails() {
  const { slug } = useParams()
  const item = [...announcements, ...events].find((entry) => entry.slug === slug)

  if (!item) {
    return (
      <div className="page-shell news-details-page">
        <div className="panel news-details-empty">
          <SearchX size={32} aria-hidden="true" />
          <h1 className="page-title">Post not found</h1>
          <p className="muted">This post is no longer in the events or announcements listings.</p>
          <Link className="button button-primary" to="/actualites">View all posts</Link>
        </div>
      </div>
    )
  }

  const isEvent = item.type === 'event'
  const listPath = isEvent ? '/actualites?type=evenements' : '/actualites?type=annonces'

  return (
    <div className="page-shell news-details-page">
      <nav className="news-breadcrumb" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/">Home</Link></li>
          <li className="flex items-center gap-2"><ChevronRight size={14} aria-hidden="true" /><Link to="/actualites">News &amp; events</Link></li>
          <li className="flex items-center gap-2"><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">{item.title}</span></li>
        </ol>
      </nav>

      <article className="panel news-article">
        <header className="news-article-header">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <NewsBadge label={isEvent ? getEventStatus(item) : item.label} />
            <p className="news-article-date">
              <CalendarDays size={16} aria-hidden="true" />
              {isEvent ? <span>{formatEventDates(item)}</span> : <time dateTime={item.date}>{formatNewsDate(item.date)}</time>}
            </p>
          </div>
          <h1 className="page-title mt-3">{item.title}</h1>
          <p className="muted mt-3">{item.summary}</p>
          {isEvent && (
            <ul className="news-logistics flex flex-wrap gap-x-5 gap-y-2">
              {item.time && <li><Clock3 size={17} aria-hidden="true" /> <time dateTime={item.time}>{item.time}</time></li>}
              <li><MapPin size={17} aria-hidden="true" /> {item.location}</li>
            </ul>
          )}
        </header>

        <img className="news-article-image" src={item.image} alt={item.imageAlt} style={{ objectPosition: item.imagePosition }} width="1200" height="490" />

        <div className="news-article-body" data-reveal>
          {item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <dl className="news-article-credits">
            <div>
              <dt>Source</dt>
              <dd><a href={item.source.url}>{item.source.label}</a></dd>
            </div>
            <div>
              <dt>{item.photo.illustrative ? 'Illustrative photo' : 'Photograph'}</dt>
              <dd>{item.photo.subject}</dd>
              <dd><a href={item.photo.url}>{item.photo.author} · {item.photo.provider || 'Wikimedia Commons'}</a> · <a href={item.photo.licenseUrl}>{item.photo.license}</a> · Image resized</dd>
            </div>
          </dl>
        </div>
      </article>

      <Link className="button button-secondary mt-5" to={listPath}>
        <ArrowLeft size={17} aria-hidden="true" /> {isEvent ? 'Back to events' : 'Back to announcements'}
      </Link>
    </div>
  )
}
