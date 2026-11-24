import './LoadingPlaceholder.css'

export default function LoadingPlaceholder({ className = '' }) {
  return <span className={`loading-card-placeholder ${className}`} aria-hidden="true" />
}
