/**
 * Validators for the company add/edit form (spec section 16). Each function
 * returns an error string, or null if the value is valid — kept simple and
 * dependency-free rather than pulling in a schema library for one form.
 */

export function requireText(value, fieldLabel) {
  if (!value || !value.trim()) return `${fieldLabel} is required.`
  return null
}

export function validateUrl(value, fieldLabel) {
  if (!value) return null // optional in most cases; pair with requireText if mandatory
  try {
    const url = new URL(value)
    if (!/^https?:$/.test(url.protocol)) {
      return `${fieldLabel} must start with http:// or https://.`
    }
    return null
  } catch {
    return `${fieldLabel} must be a valid URL.`
  }
}

export function validateGoogleFormUrl(value) {
  const urlError = validateUrl(value, 'Google Form URL')
  if (urlError) return urlError
  if (value && !/docs\.google\.com\/forms|forms\.gle/.test(value)) {
    return 'This does not look like a Google Forms link (expected docs.google.com/forms or forms.gle).'
  }
  return null
}

export function validateCGPA(value) {
  if (value === '' || value === null || value === undefined) return 'Minimum CGPA is required.'
  const num = Number(value)
  if (Number.isNaN(num)) return 'Minimum CGPA must be a number.'
  if (num < 0 || num > 10) return 'Minimum CGPA must be between 0 and 10.'
  return null
}

export function validateDate(value, fieldLabel) {
  if (!value) return `${fieldLabel} is required.`
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return `${fieldLabel} must be a valid date.`
  return null
}

/**
 * Validates the full company form object. Returns a { field: message } map —
 * an empty object means the form is valid. Deliberately mirrors the field
 * names used in the AddCompany/EditCompany form state.
 */
export function validateCompanyForm(form) {
  const errors = {}

  const nameError = requireText(form.name, 'Company name')
  if (nameError) errors.name = nameError

  const roleError = requireText(form.role, 'Job role')
  if (roleError) errors.role = roleError

  const packageError = requireText(form.package, 'Package')
  if (packageError) errors.package = packageError

  const locationError = requireText(form.location, 'Location')
  if (locationError) errors.location = locationError

  const cgpaError = validateCGPA(form.minimumCGPA)
  if (cgpaError) errors.minimumCGPA = cgpaError

  const driveDateError = validateDate(form.driveDate, 'Drive date')
  if (driveDateError) errors.driveDate = driveDateError

  const deadlineError = validateDate(form.applicationDeadline, 'Application deadline')
  if (deadlineError) errors.applicationDeadline = deadlineError

  if (!deadlineError && !driveDateError && new Date(form.applicationDeadline) > new Date(form.driveDate)) {
    errors.applicationDeadline = 'Application deadline should be on or before the drive date.'
  }

  // Google Form URL is required only to actually Publish (an active/upcoming
  // listing with no way to apply isn't useful) — Draft status can be saved
  // without one. The caller decides which check applies based on the
  // requested status.
  if (form.status !== 'draft') {
    const formUrlRequired = requireText(form.googleFormUrl, 'Google Form URL')
    if (formUrlRequired) errors.googleFormUrl = formUrlRequired
  }
  const formUrlError = validateGoogleFormUrl(form.googleFormUrl)
  if (formUrlError) errors.googleFormUrl = formUrlError

  return errors
}

/**
 * Validates the full drive form object (spec section 20 fields). Returns a
 * { field: message } map — an empty object means the form is valid.
 */
export function validateDriveForm(form) {
  const errors = {}

  if (!form.companyId) errors.companyId = 'Please select a company.'

  const roleError = requireText(form.role, 'Role')
  if (roleError) errors.role = roleError

  const dateError = validateDate(form.date, 'Date')
  if (dateError) errors.date = dateError

  const timeError = requireText(form.time, 'Time')
  if (timeError) errors.time = timeError

  const venueError = requireText(form.venue, 'Venue')
  if (venueError) errors.venue = venueError

  return errors
}

/**
 * Validates the full announcement form object. Returns a { field: message }
 * map — an empty object means the form is valid.
 */
export function validateAnnouncementForm(form) {
  const errors = {}

  const titleError = requireText(form.title, 'Title')
  if (titleError) errors.title = titleError

  const contentError = requireText(form.content, 'Content')
  if (contentError) errors.content = contentError

  const dateError = validateDate(form.publishedAt, 'Published date')
  if (dateError) errors.publishedAt = dateError

  if (form.imageUrl) {
    const imageUrlError = validateUrl(form.imageUrl, 'Image URL')
    if (imageUrlError) errors.imageUrl = imageUrlError
  }

  return errors
}
