import { ArrowRight, Megaphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
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
    </div>
  )
}
