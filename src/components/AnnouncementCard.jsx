import { formatDate } from '../utils/formatDate'

export default function AnnouncementCard({ announcement }) {
  return (
    <article className="glass glow-on-hover rounded-xl p-5 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-display font-semibold text-lg">{announcement.title}</h3>
        <time
          dateTime={announcement.publishedAt}
          className="text-xs text-muted-foreground whitespace-nowrap mt-1"
        >
          {formatDate(announcement.publishedAt)}
        </time>
      </div>
      <p className="text-sm text-muted-foreground">{announcement.content}</p>
    </article>
  )
}
