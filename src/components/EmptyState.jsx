export default function EmptyState({ title, description }) {
  return (
    <div
      role="status"
      className="rounded-lg border border-dashed border-border bg-card p-10 text-center"
    >
      <p className="font-display text-lg font-semibold mb-1">{title}</p>
      {description && <p className="text-muted-foreground max-w-md mx-auto">{description}</p>}
    </div>
  )
}
