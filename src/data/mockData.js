// ============================================================================
// SAMPLE / MOCK DATA — Phase 2 only.
//
// Every record here is clearly fictional (see FICTIONAL COMPANIES below) and
// shaped exactly like the Firestore documents defined in the schema, so that
// swapping this file for real `services/*.js` Firestore reads in Phase 5+ is
// a drop-in change — no page component should need to change its JSX.
//
// TO REMOVE BEFORE PRODUCTION: delete this file once Firestore is connected,
// and delete the `USE_MOCK_DATA` flag usage in the services layer (Phase 5).
// ============================================================================

export const USE_MOCK_DATA = true

// ---- settings/general -------------------------------------------------
// This part IS real, publicly published information about the college
// (SOEL / TNDALU), since a Settings document is meant to hold genuine
// college info, not sample data.
export const mockSettings = {
  collegeName: 'The Tamil Nadu Dr. Ambedkar Law University',
  placementCellName: 'Placement Cell — School of Excellence in Law',
  aboutText:
    'The School of Excellence in Law (SOEL) was established in 2002 to offer the five-year integrated B.A. B.L. (Hons.) degree, with a focus on making law graduates professionally competent, on par with the National Law Schools. To widen career avenues beyond conventional legal practice, the University set up a Student–Industry Interface Centre (SIIC), connecting students to banks, leading law firms, corporates, and IT majors.',
  footerText: '© ' + new Date().getFullYear() + ' Placement Cell, School of Excellence in Law · TNDALU',
  email: 'registrar@tndalu.ac.in',
  phone: '044-22439051',
  address: '"Perungudi Campus", M.G.R. Salai, Near Taramani (MRTS) Railway Station, Perungudi, Chennai - 600 113',
  secondAddress: '"Poompozhil", 5, Dr. D.G.S. Dinakaran Salai, Chennai 600 028, Tamil Nadu, India',
  officeHours: 'Monday – Saturday, 10:00 AM – 5:00 PM',
  social: {
    youtube: 'https://youtube.com/c/TNDALUMedia',
    twitter: 'https://twitter.com/Tndalu_chn',
    instagram: 'https://www.instagram.com/tndalu_lawuniversity/',
  },
  collegeWebsite: 'https://www.tndalu.ac.in',
  soelPage: 'https://www.tndalu.ac.in/school-of-excellence-in-law',
  studentsPlaced: null,
  teamMembers: [
    {
      id: 'director-soel',
      name: 'Prof. (Dr.) Ranjit Oommen Abraham',
      designation: 'Director, School of Excellence in Law',
    },
  ],
}

// ---- companies ----------------------------------------------------------
// FICTIONAL COMPANIES — for development/demo only. Replace with real
// recruiter data before this goes live; do not present these as actual
// recruiting partners.
export const mockCompanies = [
  {
    id: 'technova-solutions',
    name: 'TechNova Solutions',
    logoInitials: 'TN',
    role: 'Associate — Corporate Compliance',
    description:
      'TechNova Solutions is a fictional sample technology company used to demonstrate this page. Its compliance team supports contract review, regulatory filings, and data-protection advisory for the company\'s enterprise clients.',
    responsibilities: [
      'Review vendor and client contracts for regulatory compliance',
      'Assist in drafting data-protection and privacy policy documentation',
      'Support the legal team during internal compliance audits',
    ],
    eligibility: {
      departments: ['B.A. B.L. (Hons.)', 'B.Com. LL.B. (Hons.)'],
      minimumCGPA: 7.0,
      backlogRequirement: 'No standing backlogs at the time of interview',
      other: 'Strong drafting and written communication skills preferred',
    },
    package: '₹6,00,000 – ₹8,00,000 / year',
    location: 'Chennai (Hybrid)',
    workMode: 'Hybrid',
    driveDate: '2026-09-15',
    applicationDeadline: '2026-09-05',
    googleFormUrl: 'https://forms.gle/REPLACE-WITH-REAL-FORM-1',
    instructions: 'Carry two copies of your resume and a valid photo ID to the pre-placement talk.',
    status: 'active',
  },
  {
    id: 'innovate-systems',
    name: 'Innovate Systems',
    logoInitials: 'IS',
    role: 'Legal Associate — IP & Technology',
    description:
      'Innovate Systems is a fictional sample corporate legal department used to demonstrate this page. The IP & Technology team handles patent filings, licensing agreements, and technology transfer matters.',
    responsibilities: [
      'Support patent and trademark filing documentation',
      'Draft and review software licensing agreements',
      'Coordinate with external counsel on IP litigation matters',
    ],
    eligibility: {
      departments: ['B.A. B.L. (Hons.)', 'LL.M. (IP Law)'],
      minimumCGPA: 7.5,
      backlogRequirement: 'No standing backlogs',
      other: 'Prior moot court or IP law coursework preferred',
    },
    package: '₹7,50,000 – ₹9,50,000 / year',
    location: 'Bengaluru',
    workMode: 'On-site',
    driveDate: '2026-09-22',
    applicationDeadline: '2026-09-12',
    googleFormUrl: 'https://forms.gle/REPLACE-WITH-REAL-FORM-2',
    instructions: 'Shortlisted candidates will be informed by email 3 days before the drive.',
    status: 'active',
  },
  {
    id: 'globalsoft-technologies',
    name: 'GlobalSoft Technologies',
    logoInitials: 'GS',
    role: 'Graduate Trainee — Legal & Compliance',
    description:
      'GlobalSoft Technologies is a fictional sample MNC used to demonstrate this page. This graduate program rotates trainees across contracts, compliance, and employment law functions over 12 months.',
    responsibilities: [
      'Rotate across contracts, compliance, and employment law desks',
      'Prepare summaries of regulatory updates for the legal team',
      'Assist senior counsel with day-to-day legal operations',
    ],
    eligibility: {
      departments: ['B.A. B.L. (Hons.)', 'B.B.A. LL.B. (Hons.)', 'B.C.A. LL.B. (Hons.)'],
      minimumCGPA: 6.5,
      backlogRequirement: 'Maximum 1 standing backlog, cleared before joining',
      other: 'Open to all final-year integrated law students',
    },
    package: '₹5,50,000 / year',
    location: 'Chennai',
    workMode: 'On-site',
    driveDate: '2026-10-03',
    applicationDeadline: '2026-09-25',
    googleFormUrl: 'https://forms.gle/REPLACE-WITH-REAL-FORM-3',
    instructions: 'Written test followed by two interview rounds on the same day.',
    status: 'upcoming',
  },
  {
    id: 'meridian-law-partners',
    name: 'Meridian Law Partners',
    logoInitials: 'ML',
    role: 'Junior Associate — Litigation',
    description:
      'Meridian Law Partners is a fictional sample litigation chamber used to demonstrate this page, handling civil and commercial disputes before trial and appellate courts.',
    responsibilities: [
      'Assist in drafting pleadings, applications, and case briefs',
      'Conduct legal research on precedent and statutory provisions',
      'Accompany senior counsel to court appearances',
    ],
    eligibility: {
      departments: ['B.A. B.L. (Hons.)', 'B.A. LL.B. Degree Course'],
      minimumCGPA: 6.0,
      backlogRequirement: 'No standing backlogs',
      other: 'Strong interest in litigation practice',
    },
    package: '₹4,80,000 / year',
    location: 'Chennai',
    workMode: 'On-site',
    driveDate: '2026-08-10',
    applicationDeadline: '2026-08-01',
    googleFormUrl: 'https://forms.gle/REPLACE-WITH-REAL-FORM-4',
    instructions: 'Drive completed. Retained here as a closed-drive example.',
    status: 'closed',
  },
]

// ---- placementDrives ------------------------------------------------------
export const mockDrives = [
  {
    id: 'drive-technova',
    companyId: 'technova-solutions',
    companyName: 'TechNova Solutions',
    role: 'Associate — Corporate Compliance',
    date: '2026-09-15',
    time: '10:00 AM',
    venue: 'Seminar Hall, Perungudi Campus',
    description: 'Pre-placement talk followed by a written compliance assessment.',
    instructions: 'Report by 9:30 AM with your resume and ID card.',
    status: 'upcoming',
  },
  {
    id: 'drive-innovate',
    companyId: 'innovate-systems',
    companyName: 'Innovate Systems',
    role: 'Legal Associate — IP & Technology',
    date: '2026-09-22',
    time: '11:00 AM',
    venue: 'Conference Room, Perungudi Campus',
    description: 'Shortlisting based on resume, followed by two interview rounds.',
    instructions: 'Shortlisted students will be notified by email.',
    status: 'upcoming',
  },
  {
    id: 'drive-globalsoft',
    companyId: 'globalsoft-technologies',
    companyName: 'GlobalSoft Technologies',
    role: 'Graduate Trainee — Legal & Compliance',
    date: '2026-10-03',
    time: '9:30 AM',
    venue: 'Seminar Hall, Perungudi Campus',
    description: 'Written test followed by HR and technical interview rounds.',
    instructions: 'Formal attire required.',
    status: 'upcoming',
  },
  {
    id: 'drive-meridian',
    companyId: 'meridian-law-partners',
    companyName: 'Meridian Law Partners',
    role: 'Junior Associate — Litigation',
    date: '2026-08-10',
    time: '10:00 AM',
    venue: 'Seminar Hall, Perungudi Campus',
    description: 'Completed drive — offers rolled out on 14 August 2026.',
    instructions: '',
    status: 'closed',
  },
]

// ---- announcements ----------------------------------------------------
export const mockAnnouncements = [
  {
    id: 'ann-1',
    title: 'Placement registration open for 2026–27 batch',
    content:
      'Final and pre-final year students can now express interest in upcoming placement drives. Check the Companies page for active opportunities and apply through each company\'s official Google Form.',
    status: 'published',
    publishedAt: '2026-08-19',
  },
  {
    id: 'ann-2',
    title: 'Pre-placement talk: TechNova Solutions',
    content:
      'TechNova Solutions will conduct a pre-placement talk on 15 September 2026 at the Perungudi Campus Seminar Hall. All eligible students are encouraged to attend.',
    status: 'published',
    publishedAt: '2026-08-18',
  },
  {
    id: 'ann-3',
    title: 'Resume format guidelines updated',
    content:
      'Students applying to active opportunities should use the standard resume format shared by the Placement Cell. Contact the office if you need the template resent.',
    status: 'published',
    publishedAt: '2026-08-12',
  },
]
