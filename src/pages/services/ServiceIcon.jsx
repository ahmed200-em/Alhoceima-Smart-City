import { Building2, BusFront, Droplet, Lightbulb, Trash2, Zap } from 'lucide-react'
import './ServiceIcon.css'

const icons = {
  'bus-front': BusFront,
  zap: Zap,
  droplet: Droplet,
  'trash-2': Trash2,
  lightbulb: Lightbulb,
  'building-2': Building2,
}

export default function ServiceIcon({ icon, color }) {
  const Icon = icons[icon]

  return (
    <span className={`svc-icon svc-icon--${color}`} aria-hidden="true">
      <Icon size={25} strokeWidth={1.8} />
    </span>
  )
}
