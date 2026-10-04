import { X, Search, ChevronDown, MoreHorizontal } from 'lucide-react'

export function Avatar({ name = 'Maya Chen', color = 'lilac', small = false }) {
  return <span className={`avatar ${color} ${small ? 'avatar-sm' : ''}`}>{name.split(' ').map(p => p[0]).join('').slice(0, 2)}</span>
}
export function Status({ children }) { return <span className={`status status-${String(children).toLowerCase().replaceAll(' ', '-')}`}><i />{children}</span> }
export function PageHeading({ title, subtitle, action }) { return <div className="page-heading"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div> }
export function SearchBox({ value, onChange, placeholder = 'Search...' }) { return <label className="search-box"><Search size={17} /><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} /></label> }
export function Select({ value, onChange, children, ...props }) { return <label className="select-wrap"><select value={value} onChange={e => onChange?.(e.target.value)} {...props}>{children}</select><ChevronDown size={15} /></label> }
export function Modal({ title, onClose, children, wide = false }) { return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true"><header><h2>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={19} /></button></header>{children}</section></div> }
export function IconButton({ label = 'More actions' }) { return <button className="icon-btn row-more" aria-label={label}><MoreHorizontal size={19} /></button> }
export function EmptyState({ title, detail }) { return <div className="empty-state"><div className="empty-icon">⌕</div><strong>{title}</strong><span>{detail}</span></div> }
