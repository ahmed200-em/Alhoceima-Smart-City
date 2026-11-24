import { CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, Clock3, LoaderCircle, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useReports } from '../../context/ReportsContext'
import { filterReports, formatReportDate, reportCategoryLabel } from '../../utils/reportFormat'
import { LocalNotice, NoReports, ReportFilters, StatusBadge } from './ReportUI'
import './Dashboard.css'

const summary = [
  { label: 'Total', status: 'all', icon: ClipboardList },
  { label: 'En attente', status: 'pending', icon: Clock3 },
  { label: 'En cours', status: 'in-progress', icon: LoaderCircle },
  { label: 'Résolus', status: 'resolved', icon: CheckCircle2 },
]

const pageSize = 6
const statusParams = new Map([
  ['pending', 'en-attente'],
  ['in-progress', 'en-cours'],
  ['resolved', 'resolu'],
])

function ReportSummary({ reports }) {
  return (
    <dl className="report-summary grid grid-cols-2 gap-3 md:grid-cols-4" data-reveal-group>
      {summary.map(({ label, status, icon: Icon }) => (
        <div className={`panel report-summary-stat report-summary-stat--${status}`} key={status} data-reveal>
          <dt><Icon size={17} aria-hidden="true" /> {label}</dt>
          <dd>{status === 'all' ? reports.length : reports.filter((report) => report.status === status).length}</dd>
        </div>
      ))}
    </dl>
  )
}

function ReportsTable({ reports }) {
  return (
    <>
      <table className="report-table" data-reveal>
        <caption className="sr-only">Signalements et état de leur traitement</caption>
        <thead>
          <tr>
            <th scope="col">Référence</th>
            <th scope="col">Titre</th>
            <th scope="col">Catégorie</th>
            <th scope="col">Quartier</th>
            <th scope="col">Date</th>
            <th scope="col">Statut</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td><span className="report-reference">{report.id}</span>{report.sample && <small className="report-sample">Exemple</small>}</td>
              <th scope="row"><Link className="report-title-link" to={`/signalements/${report.id}`}>{report.title}</Link></th>
              <td>{reportCategoryLabel(report.category)}</td>
              <td>{report.neighborhood}</td>
              <td><time dateTime={report.createdAt}>{formatReportDate(report.createdAt)}</time></td>
              <td><StatusBadge status={report.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="report-mobile-list" data-reveal-group>
        {reports.map((report) => (
          <li key={report.id} data-reveal>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="report-reference">{report.id}</span>
              <StatusBadge status={report.status} />
            </div>
            <Link className="report-title-link" to={`/signalements/${report.id}`}>{report.title}</Link>
            <p className="report-help">{reportCategoryLabel(report.category)} · {report.neighborhood} · <time dateTime={report.createdAt}>{formatReportDate(report.createdAt)}</time></p>
            {report.sample && <small className="report-sample">Exemple</small>}
          </li>
        ))}
      </ul>
    </>
  )
}

export default function Dashboard() {
  const { reports, storageError } = useReports()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const requestedStatus = searchParams.get('statut')
  const status = [...statusParams].find(([, parameter]) => parameter === requestedStatus)?.[0] ?? 'all'
  const filtered = filterReports(reports, search, status)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageStart = (currentPage - 1) * pageSize
  const tableRows = filtered.slice(pageStart, pageStart + pageSize)

  function setStatus(value) {
    const next = new URLSearchParams(searchParams)
    const parameter = statusParams.get(value)
    if (parameter) next.set('statut', parameter)
    else next.delete('statut')
    setSearchParams(next, { replace: true })
    setPage(1)
  }

  function clearFilters() {
    setSearch('')
    setStatus('all')
  }

  return (
    <div className="page-shell reports-page dashboard-page">
      <header className="report-page-heading flex flex-wrap items-start justify-between gap-4" data-enter>
        <div>
          <h1 className="page-title">Mon tableau de bord</h1>
          <p className="muted">Consultez vos signalements et l’état de leur traitement.</p>
        </div>
        <Link className="button button-primary" to="/signaler"><Plus size={18} aria-hidden="true" /> Signaler un problème</Link>
      </header>

      <LocalNotice>
        Démonstration avec des signalements d’exemple. Vos ajouts restent dans ce navigateur, sans compte ni envoi à la commune.
      </LocalNotice>
      {storageError && <p className="report-banner-error" role="alert">{storageError}</p>}
      <ReportSummary reports={reports} />

      <section className="panel report-results" aria-labelledby="dashboard-reports-title">
        <h2 id="dashboard-reports-title">Mes signalements</h2>
        <ReportFilters
          search={search}
          onSearch={(value) => { setSearch(value); setPage(1) }}
          status={status}
          onStatus={setStatus}
        />
        {tableRows.length ? (
          <>
            <ReportsTable reports={tableRows} />
            <div className="report-pagination">
              <p className="report-help" role="status">{pageStart + 1}–{pageStart + tableRows.length} sur {filtered.length} signalement{filtered.length > 1 ? 's' : ''}</p>
              {pageCount > 1 && (
                <nav className="flex items-center gap-2" aria-label="Pages des signalements">
                  <button type="button" className="button button-secondary" aria-label="Page précédente" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={18} aria-hidden="true" /></button>
                  <span aria-current="page">{currentPage} / {pageCount}</span>
                  <button type="button" className="button button-secondary" aria-label="Page suivante" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}><ChevronRight size={18} aria-hidden="true" /></button>
                </nav>
              )}
            </div>
          </>
        ) : <NoReports hasReports={reports.length > 0} clearFilters={clearFilters} />}
      </section>
    </div>
  )
}
