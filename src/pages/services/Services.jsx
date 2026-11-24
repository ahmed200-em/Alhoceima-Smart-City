import { ArrowRight, Clock3, Search, SearchX } from 'lucide-react'
import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { categories, services } from '../../data/services.js'
import ServiceIcon from './ServiceIcon.jsx'
import './Services.css'

function normalize(text) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

export default function Services() {
  const [params, setParams] = useSearchParams()
  const searchRef = useRef(null)
  const query = params.get('q') || ''
  const selected = categories.find(({ id }) => id === params.get('categorie'))?.id || ''
  const keywords = normalize(query).split(/\s+/)

  const results = services.filter((service) => {
    const category = categories.find(({ id }) => id === service.category)
    const text = normalize(`${service.title} ${service.description} ${category.label}`)
    return (!selected || selected === service.category) && keywords.every((word) => text.includes(word))
  })

  function updateFilter(name, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(name, value)
    else next.delete(name)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  function resetFilters() {
    setParams({}, { replace: true, preventScrollReset: true })
    searchRef.current?.focus()
  }

  return (
    <div className="page-shell svc-page">
      <header className="mb-6">
        <h1 className="page-title">Tous les services municipaux</h1>
        <p className="muted mt-2">Trouvez un service et consultez ses horaires et ses informations pratiques.</p>
      </header>

      <section aria-label="Rechercher et filtrer les services" className="svc-filters">
        <div className="svc-search">
          <label className="sr-only" htmlFor="service-search">Rechercher un service</label>
          <input
            className="field-control"
            id="service-search"
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => updateFilter('q', event.target.value)}
            placeholder="Rechercher un service, mot-clé…"
          />
          <Search size={19} aria-hidden="true" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
          <div role="group" aria-label="Catégorie de service" className="flex flex-wrap gap-2">
            {[{ id: '', label: 'Tous' }, ...categories].map(({ id, label }) => (
              <button key={id} type="button" className="svc-filter-chip" aria-pressed={id === selected} onClick={() => updateFilter('categorie', id)}>
                {label}
              </button>
            ))}
          </div>
          {(query || selected) && (
            <button type="button" className="svc-reset" onClick={resetFilters}>Réinitialiser</button>
          )}
        </div>
      </section>

      <p className="svc-result-count" role="status">
        {results.length} {results.length === 1 ? 'service' : 'services'} · Données de démonstration
      </p>

      {results.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
          {results.map((service) => (
            <li key={service.slug} data-reveal>
              <Link className="panel svc-card" to={`/services/${service.slug}`} aria-labelledby={`service-${service.slug}`}>
                <ServiceIcon icon={service.icon} color={service.color} />
                <h2 id={`service-${service.slug}`}>{service.title}</h2>
                <p className="muted">{service.description}</p>
                <span className="svc-hours"><Clock3 size={15} aria-hidden="true" /> {service.hours}</span>
                <span className="svc-card-link">Voir les détails <ArrowRight size={16} aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="panel svc-empty">
          <SearchX size={34} aria-hidden="true" />
          <h2>Aucun service trouvé</h2>
          <p className="muted">Essayez un autre mot-clé ou changez de catégorie.</p>
          <button type="button" className="button button-secondary" onClick={resetFilters}>Afficher tous les services</button>
        </div>
      )}
    </div>
  )
}
