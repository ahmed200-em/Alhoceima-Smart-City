import { ArrowLeft, CalendarDays, ChevronRight, Clock3, Info, MapPin, SearchX } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { announcements, events } from '../../data/news.js'
import { formatNewsDate, formatNewsTime, NewsBadge } from './NewsMeta.jsx'
import './NewsDetails.css'

export default function NewsDetails() {
  const { slug } = useParams()
  const item = [...announcements, ...events].find((entry) => entry.slug === slug)

  if (!item) {
    return (
      <div className="page-shell news-details-page">
        <div className="panel news-details-empty">
          <SearchX size={32} aria-hidden="true" />
          <h1 className="page-title">Publication introuvable</h1>
          <p className="muted">Cette page est absente de l’agenda et des annonces.</p>
          <Link className="button button-primary" to="/actualites">Voir les publications</Link>
        </div>
      </div>
    )
  }

  const isEvent = item.type === 'event'
  const listPath = isEvent ? '/actualites?type=evenements' : '/actualites?type=annonces'

  return (
    <div className="page-shell news-details-page">
      <nav className="news-breadcrumb" aria-label="Fil d’Ariane">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/">Accueil</Link></li>
          <li className="flex items-center gap-2"><ChevronRight size={14} aria-hidden="true" /><Link to="/actualites">Actualités et événements</Link></li>
          <li className="flex items-center gap-2"><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">{item.title}</span></li>
        </ol>
      </nav>

      <article className="panel news-article">
        <header className="news-article-header">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <NewsBadge label={item.label} />
            <p className="news-article-date"><CalendarDays size={16} aria-hidden="true" /> <time dateTime={item.date}>{formatNewsDate(item.date)}</time></p>
          </div>
          <h1 className="page-title mt-3">{item.title}</h1>
          <p className="muted mt-3">{item.summary}</p>
          {isEvent && (
            <ul className="news-logistics flex flex-wrap gap-x-5 gap-y-2">
              <li><Clock3 size={17} aria-hidden="true" /> <time dateTime={item.time}>{formatNewsTime(item.time)}</time></li>
              <li><MapPin size={17} aria-hidden="true" /> {item.location}</li>
            </ul>
          )}
        </header>

        <img className="news-article-image" src={item.image} alt={item.imageAlt} width="1200" height="490" />

        <div className="news-article-body">
          <p className="news-note"><Info size={17} aria-hidden="true" /> Publication fictive et image d’illustration.</p>
          {item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </article>

      <Link className="button button-secondary mt-5" to={listPath}>
        <ArrowLeft size={17} aria-hidden="true" /> {isEvent ? 'Retour aux événements' : 'Retour aux annonces'}
      </Link>
    </div>
  )
}
