export const EMPTY_DRIVE_FORM = {
  companyId: '',
  companyName: '',
  role: '',
  date: '',
  time: '',
  venue: '',
  description: '',
  instructions: '',
  status: 'draft',
}

/** Converts a Firestore drive doc into this form's flat field shape. */
export function driveToFormValues(drive) {
  if (!drive) return EMPTY_DRIVE_FORM
  return {
    companyId: drive.companyId || '',
    companyName: drive.companyName || '',
    role: drive.role || '',
    date: drive.date || '',
    time: drive.time || '',
    venue: drive.venue || '',
    description: drive.description || '',
    instructions: drive.instructions || '',
    status: drive.status || 'draft',
  }
}

/** Converts this form's flat field shape back into a Firestore-shaped drive doc. */
export function formValuesToDrive(form) {
  return {
    companyId: form.companyId,
    companyName: form.companyName.trim(),
    role: form.role.trim(),
    date: form.date,
    time: form.time.trim(),
    venue: form.venue.trim(),
    description: form.description.trim(),
    instructions: form.instructions.trim(),
    status: form.status,
  }
}
