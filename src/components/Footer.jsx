import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from './Brand.jsx'
import './Footer.css'

const linkGroups = [
  {
    id: 'services',
    title: 'Municipal services',
    links: [
      { label: 'All services', to: '/services' },
      { label: 'Public transport', to: '/services/transport-urbain' },
      { label: 'Electricity', to: '/services/electricite' },
      { label: 'Drinking water', to: '/services/eau-potable' },
      { label: 'Waste management', to: '/services/gestion-des-dechets' },
    ],
  },
  {
    id: 'citoyens',
    title: 'Community',
    links: [
      { label: 'Track my reports', to: '/tableau-de-bord' },
      { label: 'Announcements', to: '/actualites?type=annonces' },
      { label: 'Events', to: '/actualites?type=evenements' },
    ],
  },
]

function scrollToCurrentPage(event) {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return

  const link = event.target.closest?.('a[href]')
  if (link?.origin !== window.location.origin || link.pathname !== window.location.pathname) return

  // Links between the two news filters keep the same pathname.
  window.scrollTo(0, 0)
  document.getElementById('contenu')?.focus({ preventScroll: true })
}

export default function Footer() {
  return (
    <footer className="site-footer" onClickCapture={scrollToCurrentPage}>
      <div className="page-shell">
        <div className="footer-content" data-reveal-group>
          <div className="footer-brand" data-reveal>
            <Brand inverse />
            <p>A demonstration portal for municipal services in Al Hoceima.</p>
            <Link className="button button-teal" to="/signaler">
              Report a problem <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation" data-reveal>
            {linkGroups.map(({ id, title, links }) => (
              <section key={id} aria-labelledby={`footer-${id}`}>
                <h2 id={`footer-${id}`}>{title}</h2>
                <ul>
                  {links.map(({ label, to }) => (
                    <li key={to}><Link to={to}>{label}</Link></li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>

        <div className="footer-meta">
          <p>Service details are for demonstration. Your reports stay in this browser.</p>
          <p>Illustrative imagery · Weather by <a href="https://open-meteo.com/">Open-Meteo</a></p>
        </div>
      </div>
    </footer>
  )
}
