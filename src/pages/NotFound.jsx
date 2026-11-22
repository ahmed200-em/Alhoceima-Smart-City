import { ArrowRight, MapPinOff, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <section className="page-shell not-found">
      <div className="panel not-found-panel">
        <span className="icon-tile icon-blue not-found-icon"><MapPinOff size={28} aria-hidden="true" /></span>
        <p className="eyebrow not-found-label">Erreur 404</p>
        <h1 className="page-title not-found-title">Page introuvable</h1>
        <p className="muted not-found-message">Vérifiez l’adresse ou reprenez votre navigation depuis l’accueil ou l’annuaire des services.</p>
        <div className="not-found-actions">
          <Link to="/" className="button button-primary">Retour à l’accueil <ArrowRight size={17} aria-hidden="true" /></Link>
          <Link to="/services" className="button button-secondary"><Search size={17} aria-hidden="true" /> Trouver un service</Link>
        </div>
      </div>
    </section>
  )
}
