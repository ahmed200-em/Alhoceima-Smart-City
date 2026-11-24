import { CheckCircle2, ClipboardCheck, LoaderCircle, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReports } from '../../context/ReportsContext'
import { reportStatuses } from '../../data/reports'
import { filterReports, reportCategoryLabel } from '../../utils/reportFormat'
import { BackToDashboard, LocalNotice, NoReports, ReportFilters, StatusBadge } from './ReportUI'
import './DemoAdmin.css'

function AdminReport({ report, onSave }) {
  const [selection, setSelection] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const chosen = selection ?? report.status

  async function save(event) {
    event.preventDefault()
    if (saving || chosen === report.status) return

    setSaving(true)
    setError('')
    const result = await onSave(report.id, chosen)
    setSaving(false)
    if (result.error) {
      setError(result.error)
      return
    }

    setSelection(null)
  }

  return (
    <li className="report-admin-item grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,auto)] lg:items-center" data-reveal>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="report-reference">{report.id}</span>
          {report.sample && <small className="report-sample">Exemple</small>}
        </div>
        <Link className="report-title-link" to={`/signalements/${report.id}`}>{report.title}</Link>
        <p className="report-help">{reportCategoryLabel(report.category)} · {report.neighborhood}</p>
        <StatusBadge status={report.status} />
      </div>

      <form className="report-admin-form" onSubmit={save}>
        <label htmlFor={`admin-status-${report.id}`}>Nouveau statut <span className="sr-only">pour {report.id}</span></label>
        <div className="flex flex-wrap items-end gap-2">
          <select
            className="field-control"
            id={`admin-status-${report.id}`}
            value={chosen}
            disabled={saving}
            onChange={(event) => { setError(''); setSelection(event.target.value) }}
          >
            {reportStatuses.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}
          </select>
          <button className="button button-primary" type="submit" disabled={saving || chosen === report.status}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
            {saving && <LoaderCircle className="motion-safe:animate-spin" size={16} aria-hidden="true" />}
          </button>
        </div>
        <p className="sr-only" role="status">{saving && 'Enregistrement du nouveau statut…'}</p>
        {error && <p className="report-field-error" role="alert">{error}</p>}
      </form>
    </li>
  )
}

export default function DemoAdmin() {
  const { reports, storageError, changeReportStatus } = useReports()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [savedReference, setSavedReference] = useState('')
  const filtered = filterReports(reports, search, status)

  async function saveStatus(id, value) {
    setSavedReference('')
    const result = await changeReportStatus(id, value)
    if (!result.error) setSavedReference(id)
    return result
  }

  return (
    <div className="page-shell reports-page">
      <header className="report-page-heading" data-enter>
        <p className="report-admin-label"><ShieldCheck size={16} aria-hidden="true" /> Accès de démonstration</p>
        <h1 className="page-title">Administration de démonstration</h1>
        <p className="muted">Mettez à jour un statut pour voir la progression dans le tableau de bord citoyen.</p>
      </header>

      <LocalNotice>Vous simulez le travail d’un agent municipal. Les changements restent dans ce navigateur et aucun compte n’est nécessaire.</LocalNotice>
      {storageError && <p className="report-banner-error" role="alert">{storageError}</p>}
      {savedReference && (
        <p className="report-notice report-admin-saved" role="status">
          <CheckCircle2 size={19} aria-hidden="true" /> <span>Statut mis à jour pour le signalement {savedReference}.</span>
        </p>
      )}

      <section className="panel report-results" aria-labelledby="admin-reports-title">
        <h2 className="flex items-center gap-2" id="admin-reports-title"><ClipboardCheck size={20} aria-hidden="true" /> Gestion des signalements</h2>
        <ReportFilters search={search} onSearch={setSearch} status={status} onStatus={setStatus} />
        {filtered.length ? (
          <ul className="report-admin-list" data-reveal-group>{filtered.map((report) => <AdminReport key={report.id} report={report} onSave={saveStatus} />)}</ul>
        ) : <NoReports hasReports={reports.length > 0} clearFilters={() => { setSearch(''); setStatus('all') }} />}
      </section>

      <BackToDashboard />
    </div>
  )
}
