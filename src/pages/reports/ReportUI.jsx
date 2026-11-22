import { ArrowLeft, CheckCircle2, Clock3, Info, LoaderCircle, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { reportStatuses } from '../../data/reports'
import './ReportUI.css'

const statusIcons = { pending: Clock3, 'in-progress': LoaderCircle, resolved: CheckCircle2 }

export function StatusBadge({ status }) {
  const entry = reportStatuses.find((item) => item.value === status)
  if (!entry) return null

  const Icon = statusIcons[status]
  return <span className={`report-status report-status--${status}`}><Icon size={15} aria-hidden="true" />{entry.label}</span>
}

export function LocalNotice({ children }) {
  return (
    <p className="report-notice">
      <Info size={19} aria-hidden="true" />
      <span>{children ?? 'Cette démonstration conserve vos signalements dans ce navigateur. Elle ne crée pas de compte et ne transmet rien à la commune.'}</span>
    </p>
  )
}

export function ReportFilters({ search, onSearch, status, onStatus }) {
  return (
    <div className="report-filters grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,auto)]">
      <div className="report-search">
        <label className="sr-only" htmlFor="report-search">Rechercher un signalement</label>
        <Search size={18} aria-hidden="true" />
        <input
          id="report-search"
          className="field-control"
          type="search"
          placeholder="Rechercher un signalement…"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
      <div>
        <label className="sr-only" htmlFor="report-status-filter">Filtrer par statut</label>
        <select id="report-status-filter" className="field-control" value={status} onChange={(event) => onStatus(event.target.value)}>
          <option value="all">Tous les statuts</option>
          {reportStatuses.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}
        </select>
      </div>
    </div>
  )
}

export function NoReports({ hasReports, clearFilters }) {
  return (
    <div className="report-empty" role="status">
      <Search size={28} aria-hidden="true" />
      <h3>{hasReports ? 'Aucun résultat trouvé' : 'Aucun signalement enregistré'}</h3>
      <p className="muted">{hasReports ? 'Essayez un autre mot-clé ou modifiez le filtre de statut.' : 'Vos signalements apparaîtront ici.'}</p>
      {hasReports ? (
        <button type="button" className="button button-secondary" onClick={clearFilters}>Réinitialiser les filtres</button>
      ) : (
        <Link className="button button-primary" to="/signaler">Signaler un problème</Link>
      )}
    </div>
  )
}

export function BackToDashboard() {
  return <Link className="report-text-link" to="/tableau-de-bord"><ArrowLeft size={16} aria-hidden="true" /> Retour au tableau de bord</Link>
}
