import {
  ArrowRight, BusFront, CalendarDays, CheckCircle2, ChevronRight, ClipboardList, Droplet,
  LayoutGrid, MapPin, Megaphone, Route, Send, Trash2, Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import WeatherCard from '../components/WeatherCard.jsx'
import { services } from '../data/services.js'
import { announcements, events } from '../data/news.js'
import { formatEventDates, getCityDate } from './news/NewsMeta.jsx'
import './Home.css'

const quickLinks = [
  { id: 'transport', title: 'Transport', description: 'Routes and timetables', icon: BusFront, color: 'blue' },
  { id: 'electricite', title: 'Electricity', description: 'Power network and connections', icon: Zap, color: 'amber' },
  { id: 'eau', title: 'Water', description: 'Water quality and outages', icon: Droplet, color: 'cyan' },
  { id: 'dechets', title: 'Waste management', description: 'Collection and drop-off points', icon: Trash2, color: 'green' },
]

const workflow = [
  { to: '/signaler', title: 'Report a problem', description: 'Describe the issue and tell us where it happened.', icon: Megaphone, color: 'cyan' },
  { to: '/tableau-de-bord', title: 'Track its progress', description: 'Check the status in your dashboard.', icon: Route, color: 'blue' },
  { to: '/tableau-de-bord?statut=resolu', title: 'See how it was resolved', description: 'Read the latest updates on your report.', icon: CheckCircle2, color: 'green' },
]

const fullDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const monthOnly = new Intl.DateTimeFormat('en-GB', { month: 'short' })

function dateAtNoon(date) {
  return new Date(`${date}T12:00:00`)
}

export default function Home() {
  const today = getCityDate()
  const upcomingEvents = events.filter(({ date, endDate }) => (endDate || date) >= today)
    .sort((left, right) => left.date.localeCompare(right.date))
  const statistics = [
    { value: '4,800', label: 'Reports handled', icon: ClipboardList },
    { value: '98%', label: 'Resolution rate', icon: CheckCircle2 },
    { value: services.length, label: 'Services listed', icon: LayoutGrid },
    { value: upcomingEvents.length, label: 'Scheduled events', icon: CalendarDays },
  ]

  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="accueil-titre" data-enter>
        <img className="hero-image" src="/images/city-bay.jpg" alt="Illustration of the bay and hillside homes of Al Hoceima" fetchPriority="high" data-source="Project illustration" data-subject="Al Hoceima Bay" />
        <div className="hero-fade" />
        <div className="page-shell hero-inner">
          <div className="hero-copy">
            <p className="hero-kicker"><span /> Citizen portal</p>
            <h1 id="accueil-titre">Welcome to<br /><strong>Al Hoceima</strong></h1>
            <p className="hero-description">Find municipal services, report a problem in your neighbourhood and follow its progress.</p>
            <div className="hero-actions">
              <Link to="/services" className="button button-primary">
                Browse services <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link to="/signaler" className="button button-teal">
                <Megaphone size={17} aria-hidden="true" /> Report a problem
              </Link>
            </div>
          </div>
          <WeatherCard />
        </div>
      </section>

      <div className="page-shell home-content">
        <section aria-label="City statistics and portal counts" data-reveal>
          <ul className="home-stats panel">
            {statistics.map(({ value, label, icon: Icon }) => (
              <li className="stat-item" key={label}>
                <span className="stat-icon"><Icon size={20} aria-hidden="true" /></span>
                <div>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="sample-caption"><span /> Report figures are for demonstration</p>
        </section>

        <section className="mt-6 md:mt-7" aria-labelledby="acces-rapides">
          <div className="home-section-heading">
            <h2 id="acces-rapides">Quick links</h2>
            <Link to="/services" className="text-link">All services <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4" data-reveal-group>
            {quickLinks.map(({ id, title, description, icon: Icon, color }) => {
              const service = services.find((item) => item.category === id)
              return (
                <Link to={service ? `/services/${service.slug}` : '/services'} key={id} className="quick-card panel" data-reveal>
                  <span className={`icon-tile icon-${color}`}><Icon size={24} strokeWidth={1.8} aria-hidden="true" /></span>
                  <ChevronRight className="quick-arrow" size={17} aria-hidden="true" />
                  <strong>{title}</strong>
                  <span className="quick-description">{description}</span>
                </Link>
              )
            })}
          </div>
        </section>

        <div className="home-updates grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:gap-5" data-reveal-group>
          <section aria-labelledby="dernieres-annonces" data-reveal>
            <div className="home-section-heading"><h2 id="dernieres-annonces">Latest announcements</h2></div>
            <div className="panel home-feed">
              <ul>
                {announcements.slice(0, 3).map(({ slug, title, date, label, image }) => (
                  <li key={slug}>
                    <Link className="feed-row announcement-row" to={`/actualites/${slug}`}>
                      <div className="feed-thumb"><img src={image} alt="" loading="lazy" width="80" height="57" /></div>
                      <div className="min-w-0">
                        <div className="feed-metadata">
                          <span className={`feed-tag ${label === 'Alert' ? 'feed-tag-alert' : ''}`}>{label}</span>
                          <time dateTime={date}>{fullDate.format(dateAtNoon(date))}</time>
                        </div>
                        <p className="feed-title">{title}</p>
                      </div>
                      <ChevronRight className="feed-arrow" size={17} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/actualites?type=annonces" className="text-link feed-all">View all announcements <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </section>

          <section aria-labelledby="evenements-a-venir" data-reveal>
            <div className="home-section-heading"><h2 id="evenements-a-venir">Upcoming events</h2></div>
            <div className="panel home-feed">
              <ul>
                {upcomingEvents.slice(0, 3).map(({ slug, title, date, endDate, location }) => (
                  <li key={slug}>
                    <Link className="feed-row event-row" to={`/actualites/${slug}`}>
                      <time className="event-date" dateTime={date}>
                        <span>{date.slice(-2)}</span>
                        <span>{monthOnly.format(dateAtNoon(date)).replace('.', '')}</span>
                      </time>
                      <div className="min-w-0">
                        <p className="feed-title">{title}</p>
                        <p className="event-location"><MapPin size={13} aria-hidden="true" /> {formatEventDates({ date, endDate })} · {location}</p>
                      </div>
                      <ChevronRight className="feed-arrow" size={17} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              {upcomingEvents.length === 0 && <p className="muted px-4 py-5 text-sm">No upcoming events are currently listed.</p>}
              <Link to="/actualites?type=evenements" className="text-link feed-all">View all events <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </section>
        </div>

        <section className="workflow-panel panel" aria-labelledby="comment-ca-marche" data-reveal>
          <h2 id="comment-ca-marche">How it works</h2>
          <ol className="grid gap-3 md:grid-cols-3">
            {workflow.map(({ to, title, description, icon: Icon, color }) => (
              <li key={title}>
                <Link to={to} className="workflow-link">
                  <span className={`icon-tile icon-${color}`}><Icon size={22} aria-hidden="true" /></span>
                  <span><strong>{title}</strong><span>{description}</span></span>
                  <Send className="workflow-arrow" size={15} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
