function today() {
  return new Date().toISOString().slice(0, 10)
}

export const EMPTY_ANNOUNCEMENT_FORM = {
  title: '',
  content: '',
  imageUrl: '',
  publishedAt: today(),
  status: 'draft',
}

/** Converts a Firestore announcement doc into this form's flat field shape. */
export function announcementToFormValues(announcement) {
  if (!announcement) return EMPTY_ANNOUNCEMENT_FORM
  return {
    title: announcement.title || '',
    content: announcement.content || '',
    imageUrl: announcement.imageUrl || '',
    publishedAt: announcement.publishedAt || today(),
    status: announcement.status || 'draft',
  }
}

/** Converts this form's flat field shape back into a Firestore-shaped announcement doc. */
export function formValuesToAnnouncement(form) {
  return {
    title: form.title.trim(),
    content: form.content.trim(),
    imageUrl: form.imageUrl.trim(),
    publishedAt: form.publishedAt,
    status: form.status,
  }
}
