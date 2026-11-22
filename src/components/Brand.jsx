import { Link } from 'react-router-dom'
import './Brand.css'

export default function Brand() {
  return (
    <Link to="/" className="brand" aria-label="SmartCity Al Hoceima, accueil">
      <img src="/phare.svg" width="40" height="46" alt="" />
      <span>
        <strong>SmartCity</strong>
        <span>Al Hoceima</span>
      </span>
    </Link>
  )
}
