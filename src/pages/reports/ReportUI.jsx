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
      <span>{children ?? 'This demo saves reports in your browser only. You can try it without an account.'}</span>
    </p>
  )
}

export function ReportFilters({ search, onSearch, status, onStatus }) {
  return (
    <div className="report-filters grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,auto)]">
      <div className="report-search">
        <label className="sr-only" htmlFor="report-search">Search reports</label>
        <Search size={18} aria-hidden="true" />
        <input
          id="report-search"
          className="field-control"
          type="search"
          placeholder="Search reports…"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
      <div>
        <label className="sr-only" htmlFor="report-status-filter">Filter by status</label>
        <select id="report-status-filter" className="field-control" value={status} onChange={(event) => onStatus(event.target.value)}>
          <option value="all">All statuses</option>
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
      <h3>{hasReports ? 'No matching reports' : 'No reports saved'}</h3>
      <p className="muted">{hasReports ? 'Try another search term or change the status filter.' : 'Reports you submit will appear here.'}</p>
      {hasReports ? (
        <button type="button" className="button button-secondary" onClick={clearFilters}>Clear filters</button>
      ) : (
        <Link className="button button-primary" to="/signaler">Report a problem</Link>
      )}
    </div>
  )
}

export function BackToDashboard() {
  return <Link className="report-text-link" to="/tableau-de-bord"><ArrowLeft size={16} aria-hidden="true" /> Back to dashboard</Link>
}
