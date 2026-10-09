const STYLES = {
  active: { bg: 'var(--badge-active-bg)', fg: 'var(--badge-active-fg)', label: 'Active' },
  upcoming: { bg: 'var(--badge-upcoming-bg)', fg: 'var(--badge-upcoming-fg)', label: 'Upcoming' },
  closed: { bg: 'var(--badge-closed-bg)', fg: 'var(--badge-closed-fg)', label: 'Closed' },
  completed: { bg: 'var(--badge-closed-bg)', fg: 'var(--badge-closed-fg)', label: 'Completed' },
  draft: { bg: 'var(--badge-draft-bg)', fg: 'var(--badge-draft-fg)', label: 'Draft' },
  published: { bg: 'var(--badge-active-bg)', fg: 'var(--badge-active-fg)', label: 'Published' },
}

export default function Badge({ status }) {
  const s = STYLES[status] || { bg: 'var(--badge-upcoming-bg)', fg: 'var(--badge-upcoming-fg)', label: status }
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
