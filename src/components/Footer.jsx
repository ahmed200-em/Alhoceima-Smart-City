import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from './Brand.jsx'
import './Footer.css'

const linkGroups = [
  {
    id: 'services',
    title: 'Services municipaux',
    links: [
      { label: 'Tous les services', to: '/services' },
      { label: 'Transport urbain', to: '/services/transport-urbain' },
      { label: 'Électricité', to: '/services/electricite' },
      { label: 'Eau potable', to: '/services/eau-potable' },
      { label: 'Gestion des déchets', to: '/services/gestion-des-dechets' },
    ],
  },
  {
    id: 'citoyens',
    title: 'Vie citoyenne',
    links: [
      { label: 'Suivre mes signalements', to: '/tableau-de-bord' },
      { label: 'Annonces', to: '/actualites?type=annonces' },
      { label: 'Événements', to: '/actualites?type=evenements' },
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
        <div className="footer-content">
          <div className="footer-brand">
            <Brand />
            <p>Portail de démonstration des services municipaux d’Al Hoceima.</p>
            <Link className="button button-teal" to="/signaler">
              Signaler un problème <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <nav className="footer-nav" aria-label="Navigation du pied de page">
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
          <p>Données municipales fictives. Vos signalements restent dans ce navigateur.</p>
          <p>Visuels d’illustration · Météo par <a href="https://open-meteo.com/">Open-Meteo</a></p>
        </div>
      </div>
    </footer>
  )
}
