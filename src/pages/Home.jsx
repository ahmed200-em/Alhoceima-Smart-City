import {
  ArrowRight, BusFront, CalendarDays, CheckCircle2, ChevronRight, ClipboardList, Droplet,
  LayoutGrid, MapPin, Megaphone, Trash2, Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { services } from '../data/services.js'
import { announcements, events } from '../data/news.js'
import './Home.css'

const quickLinks = [
  { id: 'transport', title: 'Transport', description: 'Horaires et itinéraires', icon: BusFront, color: 'blue' },
  { id: 'electricite', title: 'Électricité', description: 'Réseau et raccordement', icon: Zap, color: 'amber' },
  { id: 'eau', title: 'Eau', description: 'Qualité de l’eau et coupures', icon: Droplet, color: 'cyan' },
  { id: 'dechets', title: 'Gestion des déchets', description: 'Collecte et points de dépôt', icon: Trash2, color: 'green' },
]

const fullDate = new Intl.DateTimeFormat('fr-MA', { day: 'numeric', month: 'short', year: 'numeric' })
const monthOnly = new Intl.DateTimeFormat('fr-FR', { month: 'short' })
const cityDate = new Intl.DateTimeFormat('fr-CA', { timeZone: 'Africa/Casablanca', dateStyle: 'short' })

function dateAtNoon(date) {
  return new Date(`${date}T12:00:00`)
}

export default function Home() {
  const today = cityDate.format(new Date())
  const upcomingEvents = events.filter(({ date }) => date >= today).slice(0, 3)
  const statistics = [
    { value: '4 800', label: 'Signalements traités', icon: ClipboardList },
    { value: '98 %', label: 'Taux de résolution', icon: CheckCircle2 },
    { value: services.length, label: 'Services disponibles', icon: LayoutGrid },
    { value: events.length, label: 'Événements à l’agenda', icon: CalendarDays },
  ]

  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="accueil-titre" data-enter>
        <img className="hero-image" src="/images/city-bay.jpg" alt="Illustration de la baie et des maisons d’Al Hoceima" fetchPriority="high" data-source="Illustration fournie avec le projet" data-subject="Baie d’Al Hoceima" />
        <div className="hero-fade" />
        <div className="page-shell hero-inner">
          <div className="hero-copy">
            <p className="hero-kicker"><span /> Portail citoyen</p>
            <h1 id="accueil-titre">Bienvenue à<br /><strong>Al Hoceima</strong></h1>
            <p className="hero-description">Accédez aux services municipaux, signalez un problème et suivez son traitement pour améliorer notre ville.</p>
            <div className="hero-actions">
              <Link to="/services" className="button button-primary">
                Explorer les services <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link to="/signaler" className="button button-teal">
                <Megaphone size={17} aria-hidden="true" /> Signaler un problème
              </Link>
            </div>
          </div>

        </div>
      </section>

      <div className="page-shell home-content">
        <section aria-label="La ville en chiffres, données de démonstration">
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
          <p className="sample-caption"><span /> Données municipales de démonstration</p>
        </section>

        <section className="mt-6 md:mt-7" aria-labelledby="acces-rapides">
          <div className="home-section-heading">
            <h2 id="acces-rapides">Accès rapides</h2>
            <Link to="/services" className="text-link">Tous les services <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {quickLinks.map(({ id, title, description, icon: Icon, color }) => {
              const service = services.find((item) => item.category === id)
              return (
                <Link to={service ? `/services/${service.slug}` : '/services'} key={id} className="quick-card panel">
                  <span className={`icon-tile icon-${color}`}><Icon size={24} strokeWidth={1.8} aria-hidden="true" /></span>
                  <ChevronRight className="quick-arrow" size={17} aria-hidden="true" />
                  <strong>{title}</strong>
                  <span className="quick-description">{description}</span>
                </Link>
              )
            })}
          </div>
        </section>

        <div className="home-updates grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:gap-5">
          <section aria-labelledby="dernieres-annonces">
            <div className="home-section-heading"><h2 id="dernieres-annonces">Dernières annonces</h2></div>
            <div className="panel home-feed">
              <ul>
                {announcements.slice(0, 3).map(({ slug, title, date, label, image }) => (
                  <li key={slug}>
                    <Link className="feed-row announcement-row" to={`/actualites/${slug}`}>
                      <div className="feed-thumb"><img src={image} alt="" loading="lazy" width="80" height="57" /></div>
                      <div className="min-w-0">
                        <div className="feed-metadata">
                          <span className={`feed-tag ${label.toLowerCase().includes('alerte') ? 'feed-tag-alert' : ''}`}>{label}</span>
                          <time dateTime={date}>{fullDate.format(dateAtNoon(date))}</time>
                        </div>
                        <p className="feed-title">{title}</p>
                      </div>
                      <ChevronRight className="feed-arrow" size={17} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/actualites?type=annonces" className="text-link feed-all">Voir toutes les annonces <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </section>

          <section aria-labelledby="evenements-a-venir">
            <div className="home-section-heading"><h2 id="evenements-a-venir">Événements à venir</h2></div>
            <div className="panel home-feed">
              <ul>
                {upcomingEvents.map(({ slug, title, date, location, time }) => (
                  <li key={slug}>
                    <Link className="feed-row event-row" to={`/actualites/${slug}`}>
                      <time className="event-date" dateTime={date}>
                        <span>{date.slice(-2)}</span>
                        <span>{monthOnly.format(dateAtNoon(date)).replace('.', '')}</span>
                      </time>
                      <div className="min-w-0">
                        <p className="feed-title">{title}</p>
                        <p className="event-location"><MapPin size={13} aria-hidden="true" /> {time} · {location}</p>
                      </div>
                      <ChevronRight className="feed-arrow" size={17} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              {upcomingEvents.length === 0 && <p className="muted px-4 py-5 text-sm">Aucun événement à venir dans l’agenda de démonstration.</p>}
              <Link to="/actualites?type=evenements" className="text-link feed-all">Voir tous les événements <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </section>
        </div>

      </div>
    </div>
  )
}
