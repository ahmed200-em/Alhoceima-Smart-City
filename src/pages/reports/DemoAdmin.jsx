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
          {report.sample && <small className="report-sample">Sample</small>}
        </div>
        <Link className="report-title-link" to={`/signalements/${report.id}`}>{report.title}</Link>
        <p className="report-help">{reportCategoryLabel(report.category)} · {report.neighborhood}</p>
        <StatusBadge status={report.status} />
      </div>

      <form className="report-admin-form" onSubmit={save}>
        <label htmlFor={`admin-status-${report.id}`}>New status <span className="sr-only">for {report.id}</span></label>
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
            {saving ? 'Saving…' : 'Save'}
            {saving && <LoaderCircle className="motion-safe:animate-spin" size={16} aria-hidden="true" />}
          </button>
        </div>
        <p className="sr-only" role="status">{saving && 'Saving the new status…'}</p>
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
        <p className="report-admin-label"><ShieldCheck size={16} aria-hidden="true" /> Demo access</p>
        <h1 className="page-title">Demo administration</h1>
        <p className="muted">Update a report’s status and see the change in the citizen dashboard.</p>
      </header>

      <LocalNotice>This demo lets you try the municipal staff workflow. Changes stay in this browser and no account is needed.</LocalNotice>
      {storageError && <p className="report-banner-error" role="alert">{storageError}</p>}
      {savedReference && (
        <p className="report-notice report-admin-saved" role="status">
          <CheckCircle2 size={19} aria-hidden="true" /> <span>Status updated for report {savedReference}.</span>
        </p>
      )}

      <section className="panel report-results" aria-labelledby="admin-reports-title">
        <h2 className="flex items-center gap-2" id="admin-reports-title"><ClipboardCheck size={20} aria-hidden="true" /> Manage reports</h2>
        <ReportFilters search={search} onSearch={setSearch} status={status} onStatus={setStatus} />
        {filtered.length ? (
          <ul className="report-admin-list" data-reveal-group>{filtered.map((report) => <AdminReport key={report.id} report={report} onSave={saveStatus} />)}</ul>
        ) : <NoReports hasReports={reports.length > 0} clearFilters={() => { setSearch(''); setStatus('all') }} />}
      </section>

      <BackToDashboard />
    </div>
  )
}
