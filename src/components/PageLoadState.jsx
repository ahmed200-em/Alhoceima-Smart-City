import LoadingPlaceholder from './LoadingPlaceholder.jsx'
import './PageLoadState.css'

export function PageLoading() {
  return (
    <div className="page-shell page-loading" role="status">
      <span className="sr-only">Loading page…</span>
      <LoadingPlaceholder className="page-loading-title" />
      <LoadingPlaceholder className="page-loading-intro" />
      <div className="page-loading-grid" aria-hidden="true">
        {[1, 2, 3].map((card) => (
          <div className="panel page-loading-card" key={card}>
            <LoadingPlaceholder className="page-loading-icon" />
            <LoadingPlaceholder className="page-loading-label" />
            <LoadingPlaceholder className="page-loading-line" />
            <LoadingPlaceholder className="page-loading-line page-loading-line-short" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function PageLoadError() {
  return (
    <section className="page-shell page-loading" aria-labelledby="page-load-error">
      <div className="panel page-loading-card">
        <h1 className="page-title" id="page-load-error">This page could not load</h1>
        <p className="muted">Check your connection and try again.</p>
        <button type="button" className="button button-primary" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    </section>
  )
}
