import { ArrowRight, ChevronRight, ClipboardList, Clock3, Info, MapPin, SearchX, Send } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { categories, services } from '../../data/services.js'
import { announcements } from '../../data/news.js'
import ServiceIcon from './ServiceIcon.jsx'
import './ServiceDetails.css'

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' })

export default function ServiceDetails() {
  const { slug } = useParams()
  const service = services.find((entry) => entry.slug === slug)

  if (!service) {
    return (
      <div className="page-shell svc-details-page">
        <div className="panel svc-details-empty">
          <SearchX size={34} aria-hidden="true" />
          <h1 className="page-title">Service not found</h1>
          <p className="muted">This service is missing from the directory.</p>
          <Link className="button button-primary" to="/services">View services</Link>
        </div>
      </div>
    )
  }

  const category = categories.find(({ id }) => id === service.category)
  const related = announcements.filter((item) => item.category === service.category)
  const practicalDetails = [
    { icon: Clock3, label: 'Example hours', text: service.schedule },
    { icon: MapPin, label: 'Service area', text: service.area },
    { icon: ClipboardList, label: 'Before you make a request', text: service.access },
  ]

  return (
    <div className="page-shell svc-details-page">
      <nav className="svc-breadcrumb" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/">Home</Link></li>
          <li className="flex items-center gap-2"><ChevronRight size={14} aria-hidden="true" /><Link to="/services">Services</Link></li>
          <li className="flex items-center gap-2"><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">{service.title}</span></li>
        </ol>
      </nav>

      <header className="svc-detail-lead">
        <ServiceIcon icon={service.icon} color={service.color} />
        <div>
          <Link className="svc-category-link" to={`/services?categorie=${category.id}`}>{category.label}</Link>
          <h1 className="page-title">{service.title}</h1>
          <p className="muted mt-2">{service.description}</p>
          <Link className="button button-primary mt-4" to={`/signaler?categorie=${service.category}`}>
            <Send size={17} aria-hidden="true" /> Report a problem with this service
          </Link>
        </div>
      </header>

      <p className="svc-sample-note"><Info size={17} aria-hidden="true" /> Service hours and coverage areas are examples for this demo.</p>

      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" data-reveal-group>
        <section className="panel svc-detail-panel" aria-labelledby="service-pratique" data-reveal>
          <h2 id="service-pratique">What to know</h2>
          <dl>
            {practicalDetails.map(({ icon: Icon, label, text }) => (
              <div key={label} className="svc-detail-row">
                <Icon size={19} aria-hidden="true" />
                <div><dt>{label}</dt><dd className="muted">{text}</dd></div>
              </div>
            ))}
          </dl>
        </section>

        <section className="panel svc-detail-panel" aria-labelledby="service-info" data-reveal>
          <h2 id="service-info">Useful information</h2>
          <ul>
            {service.information.map(({ title, text }) => (
              <li key={title} className="svc-detail-row">
                <Info size={19} aria-hidden="true" />
                <div><h3>{title}</h3><p className="muted">{text}</p></div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-7" aria-labelledby="service-annonces" data-reveal>
          <h2 className="svc-section-title" id="service-annonces">Related announcements</h2>
          <ul className="panel svc-related">
            {related.map((item) => (
              <li key={item.slug}>
                <Link to={`/actualites/${item.slug}`}>
                  <span><time dateTime={item.date}>{dateFormat.format(new Date(item.date))}</time><strong>{item.title}</strong></span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <Link className="svc-related-link mt-3" to="/actualites?type=annonces">View all announcements <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>
      )}
    </div>
  )
}
