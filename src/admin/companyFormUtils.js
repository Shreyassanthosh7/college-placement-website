const EMPTY_FORM = {
  name: '',
  logoInitials: '',
  logoColor: '#D8B969',
  role: '',
  description: '',
  responsibilities: '', // textarea, one per line — split to an array on submit
  departments: '', // comma-separated — split to an array on submit
  minimumCGPA: '',
  backlogRequirement: '',
  otherEligibility: '',
  package: '',
  location: '',
  workMode: 'On-site',
  driveDate: '',
  applicationDeadline: '',
  googleFormUrl: '',
  instructions: '',
  status: 'draft',
}

/** Converts a Firestore company doc into this form's flat field shape. */
export function companyToFormValues(company) {
  if (!company) return EMPTY_FORM
  return {
    name: company.name || '',
    logoInitials: company.logoInitials || company.logoInitial || '',
    logoColor: company.logoColor || '#D8B969',
    role: company.role || '',
    description: company.description || '',
    responsibilities: (company.responsibilities || []).join('\n'),
    departments: (company.eligibility?.departments || []).join(', '),
    minimumCGPA: company.eligibility?.minimumCGPA ?? '',
    backlogRequirement: company.eligibility?.backlogRequirement || '',
    otherEligibility: company.eligibility?.other || '',
    package: company.package || '',
    location: company.location || '',
    workMode: company.workMode || 'On-site',
    driveDate: company.driveDate || '',
    applicationDeadline: company.applicationDeadline || '',
    googleFormUrl: company.googleFormUrl || '',
    instructions: company.instructions || '',
    status: company.status || 'draft',
  }
}

/** Converts this form's flat field shape back into a Firestore-shaped company doc. */
export function formValuesToCompany(form) {
  return {
    name: form.name.trim(),
    logoInitials: form.logoInitials.trim() || form.name.trim().slice(0, 2).toUpperCase(),
    logoColor: form.logoColor,
    role: form.role.trim(),
    description: form.description.trim(),
    responsibilities: form.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean),
    eligibility: {
      departments: form.departments.split(',').map((s) => s.trim()).filter(Boolean),
      minimumCGPA: Number(form.minimumCGPA),
      backlogRequirement: form.backlogRequirement.trim(),
      other: form.otherEligibility.trim(),
    },
    package: form.package.trim(),
    location: form.location.trim(),
    workMode: form.workMode,
    driveDate: form.driveDate,
    applicationDeadline: form.applicationDeadline,
    googleFormUrl: form.googleFormUrl.trim(),
    instructions: form.instructions.trim(),
    status: form.status,
  }
}

export { EMPTY_FORM }
