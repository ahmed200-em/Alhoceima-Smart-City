import { Link } from 'react-router-dom'
import './Brand.css'

export default function Brand({ inverse = false }) {
  const size = inverse ? 44 : 40
  const mark = inverse ? '/smartrif-mark-inverse.svg' : '/smartrif-mark.svg'

  return (
    <Link to="/" className={inverse ? 'brand brand-inverse' : 'brand'} aria-label="SmartRif Al Hoceima, home">
      <img src={mark} width={size} height={size} alt="" />
      <span className="brand-wordmark">
        <strong className="brand-name">Smart<span>Rif</span></strong>
        <span className="brand-place">Al Hoceima</span>
      </span>
    </Link>
  )
}
