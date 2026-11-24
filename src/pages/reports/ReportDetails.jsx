import { Check, Circle, FileSearch, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useReports } from '../../context/ReportsContext'
import { reportStatuses } from '../../data/reports'
import { formatReportDate, reportCategoryLabel } from '../../utils/reportFormat'
import { BackToDashboard, LocalNotice, StatusBadge } from './ReportUI'
import './ReportDetails.css'

function ReportTimeline({ report }) {
  const currentIndex = reportStatuses.findIndex((entry) => entry.value === report.status)

  return (
    <section className="panel report-detail-panel" aria-labelledby="report-progress-title" data-reveal>
      <h2 id="report-progress-title">Report progress</h2>
      <ol className="report-timeline">
        {reportStatuses.map((entry, index) => {
          const update = index === 0 ? report.history[0] : report.history.findLast((item) => item.status === entry.value)
          const state = index === currentIndex ? 'current' : index < currentIndex ? 'passed' : 'future'
          const Icon = state === 'future' || !update ? Circle : Check

          return (
            <li key={entry.value} data-status={state} aria-current={state === 'current' ? 'step' : undefined}>
              <span className="report-timeline-node"><Icon size={15} strokeWidth={2.5} aria-hidden="true" /></span>
              <div>
                <strong>{entry.step}</strong>
                <p className="report-help">
                  {state === 'future' ? 'Upcoming' : update ? <time dateTime={update.date}>{formatReportDate(update.date, true)}</time> : 'No update recorded'}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default function ReportDetails() {
  const { id } = useParams()
  const { reports, storageError } = useReports()
  const report = reports.find((item) => item.id === id)

  if (!report) {
    return (
      <div className="page-shell reports-page">
        <section className="panel report-empty" data-enter>
          <FileSearch size={38} aria-hidden="true" />
          <h1 className="page-title">Report not found</h1>
          <p className="muted">Check the reference and use the browser where you created the report.</p>
          {storageError && <p className="report-banner-error" role="alert">{storageError}</p>}
          <BackToDashboard />
        </section>
      </div>
    )
  }

  return (
    <div className="page-shell reports-page">
      <nav className="report-breadcrumb" aria-label="Breadcrumb">
        <Link to="/tableau-de-bord">Dashboard</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{report.id}</span>
      </nav>

      <header className="report-page-heading flex flex-wrap items-start justify-between gap-4" data-enter>
        <div className="min-w-0">
          <p className="report-reference">{report.id}</p>
          <h1 className="page-title">{report.title}</h1>
        </div>
        <StatusBadge status={report.status} />
      </header>

      {report.sample && <LocalNotice>This sample report shows how tracking works.</LocalNotice>}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]" data-reveal-group>
        <section className="panel report-detail-panel" aria-labelledby="report-description-title" data-reveal>
          <div className="flex flex-wrap items-center gap-2">
            <span className="report-category-tag">{reportCategoryLabel(report.category)}</span>
            <p className="report-help">Submitted on <time dateTime={report.createdAt}>{formatReportDate(report.createdAt, true)}</time></p>
          </div>
          <p className="report-location"><MapPin size={18} aria-hidden="true" /> <span>{report.neighborhood}{report.address && ` · ${report.address}`}</span></p>
          <h2 id="report-description-title">Problem description</h2>
          <p className="report-description">{report.description}</p>
          {report.photo && <img className="report-detail-photo" src={report.photo} alt="Photo attached to the report" />}
        </section>
        <ReportTimeline report={report} />
      </div>

      <section className="panel report-detail-panel" aria-labelledby="report-updates-title" data-reveal>
        <h2 id="report-updates-title">Updates</h2>
        <ul className="report-updates">
          {[...report.history].reverse().map((update, index) => (
            <li key={`${update.date}-${index}`}>
              <time dateTime={update.date}>{formatReportDate(update.date, true)}</time>
              <p>{update.status === 'pending' && index < report.history.length - 1
                ? 'The report was moved back to Pending.'
                : reportStatuses.find((entry) => entry.value === update.status)?.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <BackToDashboard />
    </div>
  )
}
