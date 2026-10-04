import { GraduationCap } from 'lucide-react'
export default function Brand({ compact = false }) {
  return <div className="brand"><span className="brand-mark"><GraduationCap size={21} strokeWidth={2.1} /></span>{!compact && <span className="brand-copy"><strong>Tuition<span>Hub</span></strong><small>LEARNING, SIMPLIFIED</small></span>}</div>
}
