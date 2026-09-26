const STYLES = {
  active: { bg: '#E7F6EE', fg: '#0A7A44', label: 'Active' },
  upcoming: { bg: '#EEF1F6', fg: '#1E4FA0', label: 'Upcoming' },
  closed: { bg: '#F3E7E7', fg: '#8a3b3b', label: 'Closed' },
  completed: { bg: '#F3E7E7', fg: '#8a3b3b', label: 'Completed' },
  draft: { bg: '#F1F1F1', fg: '#666666', label: 'Draft' },
  published: { bg: '#E7F6EE', fg: '#0A7A44', label: 'Published' },
}

export default function Badge({ status }) {
  const s = STYLES[status] || { bg: '#EEF1F6', fg: '#475569', label: status }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      {status === 'active' && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: s.fg }} />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: s.fg }} />
        </span>
      )}
      {s.label}
    </span>
  )
}
