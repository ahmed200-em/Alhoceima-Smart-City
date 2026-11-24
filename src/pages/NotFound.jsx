import { ArrowRight, MapPinOff, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <section className="page-shell not-found">
      <div className="panel not-found-panel">
        <span className="icon-tile icon-blue not-found-icon"><MapPinOff size={28} aria-hidden="true" /></span>
        <p className="eyebrow not-found-label">Error 404</p>
        <h1 className="page-title not-found-title">Page not found</h1>
        <p className="muted not-found-message">Check the address, return to the homepage or browse the service directory.</p>
        <div className="not-found-actions">
          <Link to="/" className="button button-primary">Back to home <ArrowRight size={17} aria-hidden="true" /></Link>
          <Link to="/services" className="button button-secondary"><Search size={17} aria-hidden="true" /> Find a service</Link>
        </div>
      </div>
    </section>
  )
}
