# College Placement Cell Website

A public website for a college Placement Cell, plus a password-protected admin
dashboard for Placement Cell staff to manage companies, drives, and
announcements — with no code changes and no server to maintain.

**Status:** Phases 1-12 are complete — companies, placement drives,
announcements, and settings are all fully live with hardened,
field-validated Firestore rules; tested (Phase 11); prepared for
deployment with `vercel.json` (Phase 12, see below — the actual push to
GitHub/Vercel needs your accounts). **Gallery and Firebase Storage were
removed entirely** (see "Gallery & Firebase Storage — removed by
request" below) — Storage requires the paid Blaze plan, which isn't
being used for this project. Mobile/tablet responsiveness was also
audited (see "Mobile & tablet responsiveness" below) — one real bug
found and fixed (the admin sidebar had no mobile handling at all).

**Branding:** uses the real TNDALU Placement Cell seal (`src/assets/logo.png`)
and a color theme sampled directly from it — light blue `#C6DEF4` background,
navy `#14263E` accent (buttons/links/headings), gold `#D8B969` kept only as
a minor brand touch. Headings and body text use EB Garamond (a serif),
per direct request, in place of the earlier sans-serif pairing. See
"Visual Design & Motion" below for the full history — dark navy/gold
theme → lighter pass → deepened/refined pass → this one, all per direct
request.

## Purpose

- Students view placement opportunities, upcoming/previous drives, and
  announcements, and apply through each company's official Google Form.
- Placement Cell admins log in to add/edit/publish that content directly.
- No student accounts, no custom application system — Google Forms handles
  applications; Firebase (Auth + Firestore only) handles everything else.

## Technology Stack

- **Frontend:** React + Vite + Tailwind CSS v4 + React Router
- **Backend:** Firebase (Authentication + Firestore only — no Storage,
  no custom server; see "Gallery removed" below for why)
- **Hosting:** Vercel (free tier, no domain required to start)
- **Applications:** Google Forms (external, linked per company)

## Getting Started (Phase 1)

```bash
cd college-placement-website
npm install
npm run dev
```

This runs the site at `http://localhost:5173`. Public pages use sample data
(clearly labeled; see Phase 2). `/admin/login` is now wired to real Firebase
Authentication — see **Creating Your First Admin** below before you can
actually sign in.

## Environment Variables

The Firebase project (`college-placement-6d775`) is already connected for
local development — `.env` exists in this zip with real values, since these
are Firebase's public Web App config values (safe to expose in frontend
code; see the note in `src/firebase/config.js`). It is still gitignored and
**will not** be pushed to GitHub from this machine.

If you ever need to point this project at a different Firebase project:

```bash
cp .env.example .env
```

Fill in the `VITE_FIREBASE_*` values from **Firebase Console → Project
Settings → General → Your apps → Web app**.

**Important for deployment (Phase 12):** `.env` never reaches Vercel via
GitHub. When you deploy, add each `VITE_FIREBASE_*` value individually under
Vercel's **Project → Settings → Environment Variables** — copy them straight
out of your local `.env`.

## Firebase Setup Status

**Done (Phase 3 — SDK wiring):**
- `firebase` SDK installed; `config.js`, `auth.js`, `firestore.js` in place.
  (`storage.js` existed briefly for Phases 8-9's Gallery/logo-upload
  features but was removed later — see "Gallery removed" below.)

**Done (this phase — Phase 4, Authentication):**
- `src/context/AuthContext.jsx` — the real authorization logic: a signed-in
  Firebase user is only treated as an admin if their `users/{uid}` Firestore
  document exists **and** has `role: "ADMIN"`. Authentication alone
  (being signed in) is never enough — this mirrors what the Firestore
  Security Rules will enforce server-side in Phase 10.
- `src/routes/ProtectedRoute.jsx` — real route guard using the context above;
  shows a loading state while auth resolves, redirects to `/admin/login`
  otherwise, and remembers where you were headed to redirect back after login
- `src/admin/AdminLogin.jsx` — real email/password form. Firebase error
  codes are mapped to plain-language messages (never raw error text), and
  wrong-email vs. wrong-password are deliberately not distinguished so a
  failed login can't be used to guess valid admin emails
- `src/layouts/AdminLayout.jsx` — sidebar shell (Dashboard, Companies,
  Placement Drives, Announcements, Settings, Log Out — Gallery was
  removed later, see below)
- `src/admin/Dashboard.jsx` — shows the real signed-in admin's name/email and
  summary stats (still computed from `mockData.js`, clearly labeled — swaps
  to live Firestore counts in Phase 5+)
- `AdminCompanies.jsx` / `AdminDrives.jsx` / `AdminAnnouncements.jsx` /
  `AdminSettings.jsx` — routed placeholder pages ("Coming in Phase N"), so
  the sidebar is fully clickable now even though their real CRUD logic
  hasn't been built yet
- Verified: `npm run build` succeeds (90 modules) and `npx oxlint src`
  reports **0 warnings, 0 errors**

## Visual Design & Motion

**Update — light blue theme (per direct request):** the site
switched from the dark navy base described below to a **light blue
background with navy as the primary accent** — same brand colors sampled
from the seal, same design system and components, just flipped from a
dark base to a light one:

- **Light blue background** (originally `#EAF3FB`, replacing the dark navy
  — every page, public and admin, uses the same light theme now
- **Navy** (`#14263E`, the exact sampled logo color) is now `--color-primary`
  — used for headings, buttons, links, and borders, instead of gold
- **Gold** (`#D8B969`) stepped back to a minor brand touch only (the logo
  itself, the "active" status pulse dot) rather than the dominant accent
  it was in the dark theme
- **`.glass`** panels changed from a translucent dark blur to a
  mostly-opaque white panel with a soft shadow and light border — the
  light-theme equivalent of the same "glass card" concept
- **`.glow-on-hover`** changed from a gold glow to a soft navy shadow —
  a bright gold glow would look wrong against a light background
- **`AuroraBackground.jsx`**'s blob colors changed from gold/navy to
  light-blue/navy, at lower opacity so they read as a soft wash of color
  rather than a jarring shape against the light background
- **`.text-shimmer`**'s gradient changed from a gold shimmer to a
  navy-to-blue one

**Follow-up refinement — deeper blue + more corporate typography (per
direct request "more light blue" and "more professional"):**

- Background deepened from `#EAF3FB` (read as near-white) to a more
  visibly blue tone
- `--color-secondary`, `--color-border`, and `--color-muted-foreground`
  darkened slightly for firmer contrast
- **`.glass` cards** tightened: less blur, a firmer two-layer elevation
  shadow, more opaque white — reads as a crisp corporate card rather than
  a soft frosted panel
- Typography swapped from **Space Grotesk** (playful, startup-leaning) to
  **Plus Jakarta Sans** (clean, institutional) for headings

**Latest — user's own further edits to `index.css` (current state,
values below are what's actually in the file right now):**

- **Background darkened again**, twice: `#EAF3FB` → `#D9EAF9` →
  `#C6DEF4` (with `--color-background-alt` at `#B3D2EA`) — each pass more
  visibly blue than the last
- **`--color-secondary`, `--color-border`, and `--color-muted-foreground`
  reverted** back to their original lighter values (`#3B6EA5`, `#C7DCEF`,
  `#4C6B8A`) — only the two background variables stayed at the deepened
  values; the intermediate "refinement" pass's contrast tweaks to those
  other three were undone
- **Typography changed again**, this time to **EB Garamond** (a serif)
  for both headings and body text, replacing the Plus Jakarta Sans /
  Space Grotesk sans-serif pairing entirely. One thing worth flagging: the
  font-family declaration had been updated to EB Garamond, but the actual
  `@import` was still loading the old font — meaning without a fix, every
  browser would have silently fallen back to Georgia/serif instead of
  actually rendering EB Garamond. Fixed by pointing the Google Fonts
  import at EB Garamond itself (with italic support, since Garamond's
  italic is often used for emphasis) and dropping the now-fully-unused
  Inter import
- **`AuroraBackground.jsx`'s hardcoded blob color synced back** to
  `#3B6EA5` to match `--color-secondary`'s reverted value — it had been
  left at the deepened `#2A5F9E` from the intermediate refinement pass,
  which was a real (if minor) inconsistency once that variable reverted

All of this lives in `src/index.css`'s `@theme` block and a handful of
  CSS classes — component code itself (`CompanyCard.jsx`, `Badge.jsx`,
  etc.) didn't need to change, since everything reads from CSS variables
  rather than hardcoded colors. The one exception was `AuroraBackground.jsx`,
  which hardcodes its two blob colors directly in JS rather than through a
  CSS variable, so those needed updating by hand.

**Original dark-theme pass (kept for historical context — no longer
current):**

Pushed deliberately away from a plain white default, per direction to make
the site feel bolder and more "futuristic" while staying inside the
college's own brand colors (sampled from the seal) rather than a generic
neon/cyberpunk palette:

- **Dark navy base** (`#0B1526`) site-wide, not just the hero — every page,
  public and admin, uses the same dark theme
- **Glass panels** (`.glass` in `index.css`) — translucent, blurred cards
  with a hairline border, used in place of plain white `bg-card` boxes
- **Gold glow** (`.glow-on-hover`) — a soft gold shadow/border on hover,
  kept subtle to read as premium rather than gamer-neon
- **Aurora background** (`AuroraBackground.jsx`) — two slow-drifting blurred
  gold/navy blobs plus a faint dot-grid, used behind the Home and Admin
  Login heroes
- **Scroll reveals** (`Reveal.jsx`, GSAP + ScrollTrigger) — fade-up on
  scroll, with an optional `stagger` mode for grids/lists
- **Count-up stats** (`CountUp.jsx`) — animates numeric stats from 0 when
  scrolled into view; non-numeric values (like the honest "—" for Students
  Placed) render as static text since there's nothing to animate
- **Shimmer headline text** (`.text-shimmer`) — animated gold gradient on
  the Home hero's key phrase (now navy/blue, see above)

**Accessibility is not optional here:** every animation respects
`prefers-reduced-motion` — either via the global CSS media query in
`index.css` (instant transitions) or, for GSAP-driven ones, an explicit
`matchMedia('(prefers-reduced-motion: reduce)')` check inside `Reveal.jsx`
and `CountUp.jsx` that renders the final state immediately with no motion.

**Bundle size:** `vite.config.js` manually splits `firebase` and `gsap` into
their own chunks (`build.rollupOptions.output.manualChunks`) so they're
cached independently from your app code — Firebase's SDK is inherently
large (auth + firestore together, no longer including Storage since it
was removed — see "Gallery & Firebase Storage — removed"), and this keeps
it from re-downloading on every app-code change.

**A note on file organization:** the context object, the `AuthProvider`
component, and the `useAuth` hook are split across three small files
(`context/auth-context.js`, `context/AuthContext.jsx`, `hooks/useAuth.js`)
rather than one. That's more files than the common single-file context
pattern, but it keeps every file exporting exactly one kind of thing
(a plain object, a component, a hook), which satisfies `react-refresh`'s
"only export components" rule with zero lint warnings for this pattern.
The same reasoning is why `CompanyForm.jsx`'s conversion helpers
(`companyToFormValues`, `formValuesToCompany`) live in a separate
`admin/companyFormUtils.js` instead of being exported alongside the form
component itself.

## Phase 5 — Companies (full CRUD)

**What's live:**
- `src/services/companyService.js` — the only file that queries the
  `companies` collection directly (`getAllCompanies`, `getVisibleCompanies`,
  `getCompanyById`, `createCompany`, `updateCompany`, `deleteCompany`,
  `setCompanyStatus`)
- `src/utils/validators.js` — required-field, CGPA range, date, and Google
  Form URL validation (spec section 16), including a cross-field check that
  the deadline isn't after the drive date
- **Public site**: `Home`, `Companies`, `CompanyDetails` all read live
  Firestore data now — no more `mockCompanies`. Draft listings are excluded
  at the query level (`getVisibleCompanies`), not just hidden in the UI, so
  there's no client-side leak of unpublished data even before Phase 10's
  rules are the final word
- **Admin site**: `/admin/companies` (table with Logo/Company/Role/Package/
  Drive Date/Deadline/Status/Actions, matching spec section 14), `/admin/
  companies/add`, `/admin/companies/edit/:id` — publish/unpublish, delete
  with a confirmation modal ("This action cannot be undone"), loading and
  error states throughout
- `firestore.rules` — hardened as of Phase 10 with field-level validation
  on every write, not just an admin check (see the Phase 10 section
  below). `storage.rules` was removed along with Gallery/Firebase Storage
  — see "Gallery & Firebase Storage — removed" below

**⚠️ Action needed — deploy `firestore.rules`:**
Firestore in production mode defaults to **deny-all**. In Firebase
Console: **Firestore Database → Rules** → paste `firestore.rules` →
**Publish**. As of Phase 10, it validates the *shape* of every write
(required fields, correct types, valid status values), not just whether
the writer is an admin — see the Phase 10 section for exactly what's
checked and what's deliberately left out (rate limiting, automated
tests). **This file changed again this phase** — if you published an
earlier version, re-publish the current one from this zip, or writes that
used to succeed may now be rejected if they don't match the validation
(this would only affect malformed data, not normal use through the admin
UI).

**Still needed before you can actually log in (please do this in Firebase Console):**

1. **Authentication → Sign-in method → Email/Password** — enable it
2. **Firestore Database** — create it (production mode, not test mode)
3. **Firestore Rules** — publish `firestore.rules` (see above — required,
   not optional)
4. **Create your first admin:**
   - Firebase Console → **Authentication → Users → Add user** — enter an
     email and password for yourself
   - Copy that user's **UID** from the Users list
   - Firebase Console → **Firestore Database → Start collection** → collection
     ID `users` → document ID = the UID you copied → add fields:
     ```
     name:  "Your Name"        (string)
     email: "you@example.com"  (string)
     role:  "ADMIN"            (string)
     ```
   - Sign in at `/admin/login` with that email/password — you should land on
     `/admin/dashboard`

Until step 4 is done, signing in will succeed at the Firebase Auth level but
`isAdmin` will stay `false` (no matching Firestore doc), and you'll be
bounced straight back to the login page — that's the authorization check
working as intended, not a bug. If you hit this, the login screen now
explains it directly (see "Bug fixes" below) instead of failing silently.

**No Storage step here anymore** — this project doesn't use Firebase
Storage at all (see "Gallery & Firebase Storage — removed" below), so
there's nothing to enable or provision for it.

## Phase 6 — Placement Drives (full CRUD)

**What's live:**
- `src/services/driveService.js` — the only file that queries the
  `placementDrives` collection directly (`getAllDrives`, `getVisibleDrives`,
  `getUpcomingDrives`, `getCompletedDrives`, `getDriveById`, `createDrive`,
  `updateDrive`, `deleteDrive`, `setDriveStatus`)
- **Denormalized `companyName`** is stored directly on each drive document
  at creation time (picked from a company dropdown in the admin form),
  rather than joined live from `companies` on every read. Public
  Drives/Previous Drives pages would otherwise need one extra Firestore
  read per drive just to show a name — worth the small tradeoff (a later
  company rename won't retroactively update old drive listings) for a
  collection read far more than it's written
- **Public site**: `Drives` (upcoming only) and `PreviousDrives` (completed
  only) both read live Firestore data — no more `mockDrives`. `Home`'s
  "Upcoming Drives" stat now counts real drives too — this actually fixes a
  pre-existing bug where it was silently counting *companies* with
  status `upcoming`, not drives at all
- **Admin site**: `/admin/drives` (table with Company/Role/Date/Time/Venue/
  Status/Actions), `/admin/drives/add`, `/admin/drives/edit/:id`. The add/edit
  form loads the companies list itself for a picker (a drive with no
  company to link to doesn't make sense), pre-fills the role from the
  selected company as a starting point, and supports three states: Draft →
  Upcoming → Completed, with its own delete confirmation modal
- `firestore.rules` — extended with a `placementDrives` block, same
  public-status / admin-full-access shape as `companies`
- Admin Dashboard now shows live Upcoming/Closed Drives counts alongside
  Companies (only Announcements remains "(sample)" until Phase 7)

**5 accepted lint warnings** (up from 3 in Phase 5 — the two new ones,
`AdminDrives.jsx` and `EditDrive.jsx`, are the exact same pattern already
explained above, not new problems): `npx oxlint src` → 0 errors.

## Phase 7 — Announcements (full CRUD)

**What's live:**
- `src/services/announcementService.js` — the only file that queries the
  `announcements` collection directly (`getAllAnnouncements`,
  `getPublishedAnnouncements`, `getAnnouncementById`, `createAnnouncement`,
  `updateAnnouncement`, `deleteAnnouncement`, `setAnnouncementStatus`)
- **Public site**: `Announcements` reads live Firestore data, sorted by
  publish date descending — no more `mockAnnouncements`. Draft
  announcements are excluded at the query level, same pattern as companies
  and drives
- **Admin site**: `/admin/announcements` (table with Title/Published/Status/
  Actions), `/admin/announcements/add`, `/admin/announcements/edit/:id` —
  title/content/published-date required, image URL optional (a plain text
  field for now; real image *upload* is Phase 8's Firebase Storage work —
  this just accepts an already-hosted URL in the meantime, clearly labeled
  as such in the form)
- `firestore.rules` — extended with an `announcements` block: public reads
  only `status == 'published'`, admin has full CRUD
- Admin Dashboard now shows a live Announcements count — **all three
  collections (Companies, Drives, Announcements) are fully live**, and
  `mockData.js` is no longer used by any of them (only Gallery and the
  About/Contact settings blurb still read from it, correctly, since Phases
  8-9 haven't happened yet)

**7 accepted lint warnings** (up from 5 in Phase 6 — the two new ones,
`AdminAnnouncements.jsx` and `EditAnnouncement.jsx`, are the exact same
`set-state-in-effect` pattern already explained above, not new problems):
`npx oxlint src` → 0 errors.

## Phase 8 — Gallery (Storage upload + lightbox) — ⚠️ LATER REMOVED, see below

**This entire feature was removed in a later session** — see "Gallery &
Firebase Storage — removed by request" further down for why and exactly
what changed. The bullets below are left as a historical record of what
was originally built, not a description of the current codebase.

**What's live:**
- `src/services/galleryService.js` — `getAllGalleryItems`,
  `getGalleryItemById`, `createGalleryItem`, `updateGalleryItem`,
  `deleteGalleryItem`. No draft/published split here (spec section 24 has
  no such concept for gallery) — everything uploaded is public immediately
- `src/firebase/storage.js` (already existed from Phase 3, now actually
  used) — `uploadFile`/`deleteFile` plus the `galleryPath()` helper
- **Admin site**: `/admin/gallery` — a real upload form (file input +
  title + optional description), with client-side validation (must be an
  image file, 5MB size cap) before it ever reaches Storage. Upload writes
  the file to Storage, gets its download URL, then creates the Firestore
  doc with that URL — the file itself is never stored in Firestore,
  matching spec section 25. Delete removes both the Storage file and the
  Firestore doc; if the Storage file is already gone for some reason, that
  failure doesn't block removing the (now-orphaned) Firestore record — the
  user asked to delete a photo, not perform two operations at once
- **Public site**: `Gallery` reads live Firestore data (no more
  `mockGallery`) into the same responsive grid + keyboard-accessible
  lightbox from earlier phases
- `storage.rules` — **new file**, separate from `firestore.rules` (Storage
  has its own security rules, checked at Firebase Console → Storage →
  Rules). Same admin-check pattern, but calls Firestore via
  `firestore.get()`/`firestore.exists()` (cross-service rules) since
  Storage rules don't have direct access to Firestore's own rule helpers.
  Public read for `gallery/*`, admin-only write/delete
- `firestore.rules` also extended: public read-all for the `gallery`
  collection (nothing to restrict — everything's public), admin-only writes

**⚠️ Action needed — deploy `storage.rules` too, not just `firestore.rules`:**
these are two *separate* rule sets in Firebase Console. Storage in
production mode also defaults to deny-all, so gallery uploads will fail
with a permission error until this is published at **Firebase Console →
Storage → Rules** → paste `storage.rules` → **Publish**. `firestore.rules`
also changed again this phase (gallery collection) — re-publish that one too.

**8 accepted lint warnings** (up from 7 in Phase 7 — the one new one,
`AdminGallery.jsx`, is the exact same `set-state-in-effect` pattern already
explained above): `npx oxlint src` → 0 errors.

## Phase 9 — Settings (site-wide config)

**What's live:**
- `src/services/settingsService.js` — `getSettings()`/`updateSettings()`
  against a single document, `settings/general` (not a whole collection —
  there's only ever one). `getSettings()` returns `null` if it's never been
  saved, which is a normal state, not an error
- `src/firebase/firestore.js` gained `upsertDocById()` — plain `updateDoc()`
  throws if the document doesn't exist yet, which is exactly the situation
  on a brand-new project before any admin has opened Settings. Uses
  `setDoc(..., {merge:true})` instead
- **`src/context/SettingsContext.jsx`** — fetches `settings/general` once
  for the whole public site (same one-fetch-shared-via-context pattern as
  notifications below). Always returns a fully-populated object: real
  saved values are merged field-by-field on top of the actual TNDALU
  defaults (`mockData.js`'s `mockSettings`), including the nested `social`
  object, so the site never shows an empty/broken page before Settings has
  been saved once, and a partial save doesn't blank out the other fields
- **Public site**: `Navbar`, `Footer`, `About`, `Contact`, and Home's
  mission blurb all read from this context now — no more hardcoded
  `mockSettings` imports scattered across pages
- **Admin site**: `/admin/settings` — one form covering Identity (college
  name, placement cell name, logo upload), Contact (email, phone,
  addresses, office hours), About & Footer text, and Links & Social Media.
  Logo upload reuses the same Storage pattern as Gallery
- `firestore.rules` and `storage.rules` both extended: `settings/general`
  is public-read (it's contact info, not sensitive), admin-only write

**9 accepted lint warnings** (up from 8 — no new ones from Phase 9 itself;
the +1 came from fixing a real bug in the notification system below, not
from Settings): `npx oxlint src` → 0 errors.

## New feature — Persistent notification system (on request)

Two related but distinct features, added on request after Phase 8:

### 1. "What's new" popup + persistent bell (fixes "students might miss the popup")

The original Home-only toast (Phase 8) is still there, but the actual fix
for *missing* it is a **persistent bell icon in the navbar**, visible on
every public page:

- **`src/context/NotificationContext.jsx`** (replaces the earlier
  `useNewContentAlert` hook entirely) — fetches companies/drives/
  announcements once for the whole public site, shared by both Home's
  stats/lists and the bell, instead of two separate fetches
- "New since last visit" still uses a plain `localStorage` timestamp on
  the visitor's own browser (no student accounts exist, per spec section
  3) — first-ever visit reports nothing as new (there's no "before" to
  compare against); every visit after that, anything with a Firestore
  `createdAt` later than the *previous* visit counts
- **The key design decision**: the stored timestamp only advances when
  `markSeen()` is called — which only happens when the bell is actually
  opened. Loading the page, an auto-dismissing toast, or closing the toast
  with the × do **not** clear it. That's deliberately the whole point:
  those are exactly the ways a visitor could miss the popup, and none of
  them should silently mark it "seen" on their behalf
- `src/components/NotificationBell.jsx` — bell + numeric badge (`9+` past
  9), click opens a dropdown with counts per category and links; closes on
  outside-click or Escape
- `src/components/NewContentToast.jsx` — unchanged in spirit, updated to
  make explicit in its own doc comment that dismissing it is purely local
  and never touches the shared "seen" state

**A real bug I caught while wiring this up:** the linter flagged
`NotificationContext.jsx` reading a ref's `.current` value during render
(`previousVisitRef.current`) — a genuine React anti-pattern, not a style
nitpick, since a value read this way can go stale without triggering a
re-render. Fixed by converting `previousVisit` to real state; `fetchTimeRef`
stays a ref since it's only ever read inside the `markSeen()` event
handler, never during render.

### 2. Admin sidebar notification badges

- `src/hooks/useAdminRecentCounts.js` — small numeric badges next to
  Companies/Placement Drives/Announcements in the admin sidebar
  (`AdminLayout.jsx`), visible from any admin page
- Deliberately **not** the same "since your last visit" mechanism as the
  public bell — there's no per-admin session-tracking infrastructure, and
  multiple admins may share the same team. Instead this is a plain rolling
  "added in the last 48 hours" window, labeled as such via a tooltip
  (`title="Added in the last 48 hours"`) so it's honest about what it
  means rather than implying personalized unread tracking that doesn't exist

## Gallery & Firebase Storage — removed by request

Gallery uploads hit a CORS error tied to Firebase Storage requiring the
paid **Blaze plan** to provision the modern default bucket — confirmed via
the actual browser console error, not just a guess. Rather than requiring
a paid plan for one feature, **Gallery and Firebase Storage were removed
from the project entirely**, per direct request. This wasn't a partial
disable — every trace of it is gone:

- **Deleted:** `src/pages/Gallery.jsx`, `src/admin/AdminGallery.jsx`,
  `src/services/galleryService.js`, `src/firebase/storage.js`,
  `storage.rules`
- **`firebase/storage` SDK import removed** from `src/firebase/config.js`
  — `getStorage()` is no longer called anywhere, and `storageBucket` is no
  longer a required env var (still accepted if present, just unused)
- **Routes removed:** public `/gallery`, admin `/admin/gallery` — gone
  from `App.jsx`, the navbar (`Navbar.jsx`), and the admin sidebar
  (`AdminLayout.jsx`, including its now-unused `ImageIcon`)
- **`firestore.rules`**: the `gallery` collection block removed entirely
- **Settings' Logo field changed** from a file-upload (which used Storage)
  to a **plain URL text field** — paste a link to an already-hosted image
  instead. `AdminSettings.jsx` no longer imports or calls `uploadFile`
  anywhere
- **`AnnouncementForm.jsx`'s optional Image URL field** already only ever
  accepted a pasted URL, never a file upload — its help text was updated
  to explain why (no Storage in this project) rather than say uploads are
  "coming soon"
- `mockData.js`'s `mockGallery` sample data deleted

**Net effect:** this project now only uses Firebase Authentication and
Firestore — no Storage, no Blaze plan requirement, nothing to pay for.

**Verified:** rebuilt after every change above — module count actually
dropped (118 → 112), confirming the removal wasn't just routes hidden
behind dead code. `npx oxlint src` → 0 errors (8 warnings, all the same
pre-existing documented pattern, down from 9 since one instance
disappeared along with `AdminGallery.jsx`).

## Real-time notifications (no more page reload needed)

Two things changed here, both from direct feedback:

**1. "It should go after I have seen the posts, spontaneously"** — this
was already mostly true from the last session's redesign
(`markCategorySeen` fires the moment a visitor lands on Companies/Drives/
Announcements, not from opening the bell), but I re-verified end-to-end:
`NotificationBell.jsx`'s doc comment and behavior, and all three public
pages, are consistent — visiting a section is what clears its badge, the
bell itself never clears anything by being opened.

**2. "I want the notifications to be spontaneous... without me having to
reload the page"** — this was a real gap. `NotificationContext.jsx`
previously did one-time reads (`Promise.all` of three `getAll()` calls) on
mount. If an admin published something while a visitor already had the
site open, nothing would appear until that visitor manually refreshed.

Fixed by switching to Firestore's real-time listeners:
- `src/firebase/firestore.js`'s `subscribeToCollection()` now accepts an
  `onError` callback (previously missing — `onSnapshot` reports failures
  through a second callback, not a rejected promise, so errors were
  silently swallowed before this)
- New live-subscribe functions per collection: `subscribeToVisibleCompanies`,
  `subscribeToUpcomingDrives`, `subscribeToPublishedAnnouncements`
- `NotificationContext.jsx` now uses these instead of one-time fetches —
  when an admin publishes a company, drive, or announcement, every open
  tab of the public site updates within moments, no reload
- `Companies.jsx`, `Drives.jsx`, and `Announcements.jsx` were all
  refactored to read from this same shared live context instead of each
  doing their own separate one-time fetch — fewer Firestore reads overall,
  and all three pages are now live too, not just the notification system

**Note on scope:** this makes the *notification system and the three main
public list pages* (Companies/Drives/Announcements) live, plus Settings
(see below). `CompanyDetails` and the admin pages still use one-time
reads — say the word if you want those live too as well.

### Settings are now real-time too

Same fix, applied to `SettingsContext.jsx`: it previously did a one-time
`getSettings()` read on mount, so an admin saving changes in
`AdminSettings.jsx` wouldn't be reflected on the public site (Navbar,
Footer, About, Contact, Home's mission blurb) until a manual reload.

- `src/firebase/firestore.js` gained `subscribeToDoc()` — the
  single-document counterpart to `subscribeToCollection()`, same
  `onError` callback shape, returns `null` if the document doesn't exist
  yet (matching `getOne()`'s convention)
- `settingsService.js` gained `subscribeToSettings()`
- `SettingsContext.jsx` now uses it instead of `getSettings()` — save a
  change in the admin Settings form, and every open tab of the public
  site updates within moments, no reload

**Deliberately NOT changed:** `AdminSettings.jsx`'s own form still loads
the current settings with a one-time fetch, not a live listener. A live
listener there would risk overwriting an admin's in-progress edits mid-typing
if the document changed underneath them (e.g. another admin saving at the
same time) — that's the right call for a form you're actively editing, not
an oversight.

## Date/time formatting consistency

`src/utils/formatDate.js` gained two new helpers:
- **`formatTime(time24)`** — converts the raw 24-hour string an
  `<input type="time">` stores (e.g. `"14:00"`) into a friendly 12-hour
  format (`"2:00 PM"`). This was the one place still showing a raw,
  unstyled value next to `formatDate()`'s polished `"15 Sep 2026"` output
  everywhere else — applied to `DriveCard.jsx` (public) and
  `AdminDrives.jsx` (admin table)
- **`formatTimestamp(timestamp)`** — same polished style, for raw
  Firestore `Timestamp` fields (`createdAt`/`updatedAt`) rather than the
  plain ISO date strings `formatDate()` expects. Applied to
  `AdminGallery.jsx`, which previously showed no upload date at all next
  to each photo — now consistent with how every other admin list
  (Companies/Drives/Announcements) shows a date

## Phase 10 — Security (hardened rules)

**What changed:**
- `firestore.rules` rewritten with **field-level validation on every
  write**, not just the `isAdmin()` check: `isValidCompany()`,
  `isValidDrive()`, `isValidAnnouncement()` each verify required fields
  are present, are the right type, within a sane length, and that
  `status` is one of the expected enum values. `isAdmin()` alone only
  answers "is this write allowed at all?" — these answer "is this
  actually a well-formed document?", which matters if an admin account is
  ever compromised or the admin UI has a bug
- `storage.rules` was also hardened with file-level validation at the
  time, but **both Gallery and `storage.rules` were removed entirely in a
  later session** — see "Gallery & Firebase Storage — removed" above.
  `isValidGalleryItem()` (Firestore) and `isValidImageUpload()` (Storage)
  no longer exist
- **`settings` deliberately has no field validation** — it has many
  legitimately optional fields (social links, secondary address) that
  vary by what an admin has filled in; a strict schema there would fight
  the form rather than protect anything meaningful

**What Phase 10 deliberately does NOT include, documented rather than
pretended:**
- **Rate limiting.** Firestore Security Rules have no concept of request
  rate — that requires Firebase App Check and/or Cloud Functions with
  their own quota logic, neither of which is set up in this project. Real
  concern later → that's the next addition, not a rules tweak.
- **Automated security tests.** There's no test framework in this project
  (per the "avoid unnecessary libraries" instruction), so testing
  unauthorized access is a manual checklist below rather than a Firebase
  Emulator Suite test file. Say the word if you want that set up — it's a
  legitimate next step, just a bigger addition than editing rules.

**Manual security testing checklist** (spec section 11's "Security"
tests, done by hand against the deployed rules):

| Test | How to check | Expected result |
|---|---|---|
| Unauthenticated user can't reach admin dashboard | Open `/admin/dashboard` in a private/incognito window | Redirected to `/admin/login` |
| Signed-in but non-admin user can't reach admin dashboard | Sign in with a Firebase Auth user that has no `users/{uid}` doc (or `role != 'ADMIN'`) | "Not authorized as admin" screen, not the dashboard |
| Public visitor can't read draft companies/drives/announcements | In browser DevTools console on the public site, try `getDoc(doc(db, 'companies', '<a-draft-id>'))` | Rejected with `permission-denied` |
| Public visitor can't write anything | In DevTools console, try `updateDoc(doc(db, 'companies', '<any-id>'), {status: 'active'})` while signed out | Rejected with `permission-denied` |
| Malformed writes rejected even for admins | While signed in as admin, try creating a company via DevTools console with `status: 'not-a-real-status'` | Rejected with `permission-denied` (fails `isValidCompany`) |
| `users` collection is fully locked from client writes | While signed in as admin, try `updateDoc(doc(db, 'users', '<your-uid>'), {role: 'ADMIN'})` — redundant, but also try `setDoc` on a *different* uid | Both rejected — `allow write: if false` covers every user, not just self-writes to fields other than role |

## Hidden admin login (no visible link for students)

The Footer's "Admin Login" link has been removed — nothing on the public
site links to `/admin/login` anymore.

**How admins log in now:** navigate directly to `/admin/login` (e.g.
`https://yoursite.com/admin/login`) and bookmark it. The route itself
still works exactly as before; it's just not linked from anywhere a
student would see.

**Being upfront about what this does and doesn't do:** removing the link
is about not putting the admin entry point in front of students by
default — it is *not* real access control, and I don't want to imply it
is. Anyone who knows or guesses the URL can still reach the login page
(and Firebase project IDs/URLs are visible in the page source regardless).
The actual security is unchanged and was never based on hiding this URL:
`ProtectedRoute` + `AuthContext`'s `isAdmin` check + Firestore's
`users/{uid}.role == 'ADMIN'` rule are what actually gate access, and
reaching the login *page* was never the same thing as being able to sign
in successfully or do anything once there. This change is purely about
not surfacing an "Admin Login" button in a place students would
naturally see it.

### Confirmed: no public registration (nothing changed here)

Explicitly confirming, since it came up: **there is no admin registration
page, and none was added.** `grep`-ing the whole `src/` tree for
`AdminRegister`, `admin/register`, `createUserWithEmailAndPassword`, or
`signUp` turns up nothing — the only way to create an admin account is
still manually, in Firebase Console (see "Creating Your First Admin"
above). This was true before this request and remains true now; there
was no code to remove.

### The "not authorized" screen no longer reveals implementation details

Separately, cleaned up what's actually *shown* on screen when someone is
signed in but not an approved admin — **the rules and security logic
are byte-for-byte unchanged**, only the on-screen text changed:

- Previously, the fallback message read *"Ask the site owner to add a
  users/{uid} document with role 'ADMIN' for this account in Firebase
  Console"* — exposing Firestore's internal document path and schema to
  anyone who reaches this screen.
- Now it reads a plain *"Please contact the site administrator for
  access."* The detailed diagnostic (which Firestore error occurred, and
  what it usually means — e.g. `permission-denied` almost always means
  `firestore.rules` isn't published) still exists, but goes to the browser
  **console** (`console.error`, visible only with DevTools open) instead
  of the page itself. You (the developer/site owner) can still see it
  when debugging; a student or anyone else who happens to reach this
  screen just sees a normal, non-technical message.
- Changed in `AuthContext.jsx` (the `catch` block around the profile
  lookup) and `AdminLogin.jsx` (the fallback string on the "not
  authorized" screen) — no changes to `ProtectedRoute.jsx`, `firestore.rules`,
  or the `isAdmin` check itself.

## Bug fixes (post-Phase 5, before Phase 6)

Two real issues were found and fixed while testing Phase 5 login, both in
`AdminLogin.jsx` / `AuthContext.jsx`:

1. **Race condition on login.** The login form used to navigate to
   `/admin/dashboard` the instant Firebase sign-in resolved — but the
   `users/{uid}` admin-role lookup happens asynchronously right after, in
   `AuthContext`. If that lookup hadn't finished yet, `ProtectedRoute` would
   see "not yet confirmed admin" and immediately bounce back to the login
   page. Fixed by removing the imperative `navigate()` call entirely — the
   login page now redirects only in reaction to the real `isAdmin` value
   from context, once it's actually known.
2. **Silent failure when signed in but not an admin.** Previously this just
   showed the empty login form again with no explanation. It now shows an
   explicit "Not authorized as admin" screen naming the signed-in email and
   the reason, with a sign-out button — including a specific
   `permission-denied` message ("Have you published `firestore.rules`?")
   when the cause is Firestore rules blocking even a self-read, which was
   the actual root cause the one time this came up in testing.

A **Home button** was also added to `/admin/login` (top-left corner, plus a
link on the "not authorized" screen) so anyone who lands there isn't stuck
without a way back to the public site.

## Project Structure

```
src/
├── components/   Shared UI — Navbar, Footer, cards, Badge, EmptyState,
│                 Reveal (scroll animation), AuroraBackground, CountUp,
│                 NewContentToast, NotificationBell (done, bonus feature)
├── layouts/      PublicLayout (nav + footer), AdminLayout (sidebar with
│                 notification badges, done Phase 4 + bonus feature)
├── pages/        Public routes: Home, About, Companies, CompanyDetails,
│                 Drives, Announcements, PreviousDrives, Contact
│                 (Gallery removed — see "Gallery & Firebase Storage — removed")
├── admin/        AdminLogin, Dashboard, AdminCompanies, AddCompany, EditCompany,
│                 CompanyForm + companyFormUtils, AdminDrives, AddDrive, EditDrive,
│                 DriveForm + driveFormUtils, AdminAnnouncements, AddAnnouncement,
│                 EditAnnouncement, AnnouncementForm + announcementFormUtils,
│                 AdminSettings (done, Phases 4-9; AdminGallery removed)
├── firebase/     Firebase SDK init — config.js (Auth + Firestore only, no
│                 Storage), auth.js, firestore.js (upsertDocById,
│                 subscribeToCollection now with onError)
├── services/     companyService.js, driveService.js, announcementService.js,
│                 settingsService.js (done, Phases 5-9; galleryService.js
│                 removed) — one file per collection, each with a live
│                 subscribe*() variant used by NotificationContext for
│                 real-time updates
├── hooks/        useAuth (Phase 4), useAdminRecentCounts (admin sidebar badges,
│                 bonus feature), useNotifications (bonus feature),
│                 useSettings (Phase 9)
├── context/      auth-context.js + AuthContext.jsx (Phase 4), notification-context.js
│                 + NotificationContext.jsx (bonus feature — now real-time via
│                 onSnapshot, not one-time reads), settings-context.js
│                 + SettingsContext.jsx (Phase 9) — each split context-object-vs-
│                 provider-vs-hook across files for the same fast-refresh reason
├── routes/       ProtectedRoute (done, Phase 4 — real auth guard)
└── utils/        formatDate.js (+ formatTime, formatTimestamp — added this
                  session for site-wide date/time consistency), validators.js
```

Also at the project root: `firestore.rules` (see "Firebase Setup Status"
above). There's no `storage.rules` — this project doesn't use Firebase
Storage at all (see "Gallery & Firebase Storage — removed").

## Roadmap

1. **Project setup** ✅
2. **Public UI with mock data** ✅
3. **Firebase project wiring** ✅
4. **Authentication (admin login, protected routes)** ✅
5. **Companies (full CRUD + Google Form field)** ✅
6. **Placement Drives (full CRUD)** ✅
7. **Announcements (full CRUD)** ✅
8. ~~Gallery (Storage upload + lightbox)~~ — **built, then removed by
   request** (Firebase Storage requires the paid Blaze plan; see "Gallery
   & Firebase Storage — removed")
9. **Settings (site-wide config — no hardcoded college info)** ✅
10. **Security (Firestore rules)** ✅
11. **Testing** ✅
12. **Deploy to Vercel → handover** ✅ (this phase)

## Phase 11 — Testing

No test framework is set up in this project (per "avoid unnecessary
libraries" from the original brief) — this is a manual testing checklist,
following the structure of the original spec's Phase 11 ("Student", "Admin",
"Security"). Two honesty notes before the checklist itself:

1. **What I could actually verify vs. what needs your click-through.** I
   don't have a live browser connected to your real Firebase project, so I
   can't click every button myself. What I *did* verify: every route
   renders without a build/runtime error (`npm run build` succeeds, 112
   modules), every page component that fetches data has a loading/error/
   empty state (checked by reading each file), and the security rules
   logic was traced by hand against each scenario. The "✅ code-verified"
   column below reflects that; the "☐ needs your check" column is what
   only makes sense against your actual deployed site with real data in it.
2. **Automated tests are a legitimate next step, just a bigger one.** If
   you want real automated coverage later, the natural next addition would
   be the Firebase Local Emulator Suite + Vitest — but that's new tooling,
   not a checklist, so it wasn't added without being asked for.

### Student flow

| Test | Code-verified | Needs your check |
|---|:---:|:---:|
| Can view the public website without logging in | ✅ no route requires auth except `/admin/*` | |
| Can view companies (active/upcoming) | ✅ `Companies.jsx` renders from live `NotificationContext` data | ☐ confirm real data shows once you've added a company |
| Can view a single company's details | ✅ `CompanyDetails.jsx` fetches by id, handles not-found | ☐ click through from the list |
| Can click "Apply Now" → opens the Google Form | ✅ `<a target="_blank">` to `company.googleFormUrl` | ☐ confirm it's a real form once you've pasted a real URL |
| Can view upcoming drives | ✅ `Drives.jsx` | ☐ |
| Can view previous (completed) drives | ✅ `PreviousDrives.jsx` | ☐ |
| Can view announcements | ✅ `Announcements.jsx`, sorted newest-first | ☐ |
| Empty states look right with zero data | ✅ every list page has an `EmptyState` for the zero-items case | ☐ confirm wording reads naturally on a fresh project |
| ~~Can view gallery~~ | — | — removed; see "Gallery & Firebase Storage — removed" |
| Notification bell shows/clears correctly | ✅ traced the logic by hand (see "Real-time notifications") | ☐ this one **really does need a live click-through** — add a company while the site is open in another tab, confirm the bell badge appears without a reload, then visit Companies and confirm it clears |
| Settings changes appear live, no reload | ✅ traced the logic by hand (see "Settings are now real-time too") | ☐ **needs a live click-through** — with the public site open in one tab, change something in Admin Settings (e.g. the phone number) in another tab, confirm the Footer updates in the first tab without a reload |

### Admin flow

| Test | Code-verified | Needs your check |
|---|:---:|:---:|
| Can log in | ✅ `AdminLogin.jsx` wired to real Firebase Auth | ☐ **needs your actual admin account** — see "Creating Your First Admin" |
| Can't log in without being an approved admin | ✅ `AuthContext`'s `isAdmin` check, traced by hand | ☐ |
| Can add a company | ✅ `AddCompany.jsx` → `companyService.createCompany` | ☐ |
| Can edit a company | ✅ `EditCompany.jsx` | ☐ |
| Can delete a company (with confirmation) | ✅ `AdminCompanies.jsx` confirm-delete modal | ☐ |
| Can publish/unpublish a company | ✅ status toggle in `AdminCompanies.jsx` | ☐ |
| Can add a Google Form link to a company | ✅ `CompanyForm.jsx`'s Google Form URL field, validated | ☐ |
| Can add/edit/delete a placement drive | ✅ same CRUD pattern as companies | ☐ |
| Can add/edit/delete an announcement | ✅ same CRUD pattern | ☐ |
| ~~Can upload a gallery image~~ | — | — removed; see "Gallery & Firebase Storage — removed" |
| Can edit site-wide Settings | ✅ `AdminSettings.jsx`, upserts `settings/general` | ☐ |
| Can log out | ✅ `AdminLayout.jsx`'s Log Out button → `signOut()` | ☐ |
| Sidebar badges reflect recently-added items | ✅ `useAdminRecentCounts`, 48h rolling window | ☐ |

### Security

Covered in detail by the table in the Phase 10 section above (unauthenticated
access, non-admin access, malformed writes, locked-down `users` collection)
— not duplicated here. That table is written the same way: traceable from
the rules themselves, but the DevTools-console steps need to be run against
your actual deployed rules to be a real test rather than a read-through.

## Design System

Updated from the original light "Minimalism/Swiss" pass to a bolder,
animated direction, per direct request — colors still sampled from the
college's own seal, not a generic palette:

- **Colors:** deep navy background `#0B1526` (not black — keeps a
  law-school "authority" feel rather than reading as generic dark-mode),
  gold `#D8B969` as the primary accent/CTA color, glass-panel card surfaces
  (translucent + `backdrop-filter: blur`) instead of solid white or flat
  dark blocks. See `src/index.css` `@theme` and the `.glass`/`.glow-on-hover`
  utility classes.
- **Type:** `Space Grotesk` (headings) + `Inter` (body).
- **Motion:** GSAP-powered — `Reveal.jsx` (scroll-triggered fade-up,
  supports staggered children), `CountUp.jsx` (animated stat numbers),
  `AuroraBackground.jsx` (drifting gradient blobs + dot-grid texture behind
  hero sections), a shimmering gradient headline (`.text-shimmer`), and a
  pulsing dot on "active" status badges. **All motion respects
  `prefers-reduced-motion: reduce`** — reveals render in their final visible
  state immediately, aurora blobs stop drifting, per the design-system
  tool's accessibility checklist.
- **Admin dashboard** now shares the same dark/glass theme as the public
  site (sidebar + glass stat cards) rather than a separate light theme —
  kept consistent once the overall direction moved dark, since maintaining
  two visual systems side by side would add complexity for no real benefit.

Design system generated via the `ui-ux-pro-max` skill (motion dial 6–8/10,
variance 6–7/10), cross-checked against 21st.dev's component catalog for the
admin sidebar layout reference.

## Mobile & tablet responsiveness

Audited on request. One real gap found and fixed, plus a couple of
smaller robustness fixes:

- **`AdminLayout.jsx` — the actual gap.** The sidebar was a fixed `w-64`
  with no responsive handling at all — on a phone (375px wide) it would
  have permanently occupied over two-thirds of the screen, leaving barely
  any room for content. Converted it into a proper responsive drawer:
  fixed and always visible on desktop (`md:` and up), a slide-in overlay
  toggled by a hamburger button below that, with a backdrop that closes it
  on tap and auto-closes when a nav link is clicked. This was a genuine
  bug, not a polish item — every admin page was affected.
- **`NotificationBell.jsx`'s dropdown** — capped with
  `max-w-[calc(100vw-2rem)]` alongside its existing `w-72`, so it can't
  overflow off-screen on very narrow phones (320-360px) where a fixed
  288px-wide dropdown anchored to the right edge could otherwise clip.
- **Confirmed already fine, no changes needed:** the public `Navbar`
  already had a mobile hamburger menu; all three admin tables
  (`AdminCompanies`/`AdminDrives`/`AdminAnnouncements`) already wrap their
  `<table>` in `overflow-x-auto` with a `min-width`, so they scroll
  horizontally on narrow screens instead of breaking the page layout;
  Home's hero text uses `text-4xl sm:text-6xl` (scales down for phones);
  the Companies filter bar uses `flex flex-wrap`, so filters wrap onto
  multiple lines instead of overflowing; all forms use `grid sm:grid-cols-2`
  patterns that correctly collapse to a single column below the `sm`
  breakpoint.
- **iPad specifically:** portrait width (768px) sits right at Tailwind's
  `md` breakpoint, so it gets the desktop sidebar (not the mobile drawer)
  with a workable ~500px of content width remaining — reasonable, not
  cramped. Landscape (1024px) comfortably fits the 3-column card grids.

## Phase 12 — Deploy to Vercel

**What I could actually do from here (no GitHub/Vercel account access):**
- Added **`vercel.json`** — this is the one thing that would have silently
  broken production if skipped. Vercel serves a Vite build as plain static
  files by default, with no automatic fallback for client-side routes.
  Without this file, directly visiting or refreshing any nested route
  (`/companies/some-id`, `/admin/dashboard`, anything that isn't exactly
  `/`) would 404 in production, even though it works fine locally — Vite's
  own dev/preview servers have SPA fallback built in, which masks this
  exact problem until it's live.
- Confirmed `package.json`'s `build`/`preview` scripts are exactly what
  Vercel's zero-config Vite detection expects — nothing to change there.
- Confirmed `.gitignore` already excludes `node_modules`, `dist`, and
  `.env` — nothing sensitive would be pushed if you `git init` this folder
  as-is.

**What only you can do (needs your GitHub/Vercel/Firebase accounts):**

### 1. Push to GitHub

```bash
cd college-placement-website
git init
git add .
git commit -m "Initial commit — Phases 1-12"
```

Create a new empty repository on GitHub (no README/license — this project
already has one), then:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

`.env` will **not** be pushed (it's gitignored) — that's intentional, see
step 3.

### 2. Import into Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project**
2. Import the GitHub repo you just pushed
3. Vercel should auto-detect **Vite** as the framework — if it asks,
   confirm: Build Command `npm run build`, Output Directory `dist`
4. **Don't click Deploy yet** — add the environment variables first (next
   step), since a build without them will fail at `firebase/config.js`'s
   startup check (`Missing Firebase config values...`)

### 3. Add environment variables

In the Vercel project's **Settings → Environment Variables**, add each
value from your local `.env` individually:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID   (if you have one)
```

(No `VITE_FIREBASE_STORAGE_BUCKET` needed — this project doesn't use
Firebase Storage, see "Gallery & Firebase Storage — removed by request".)

Apply these to all three environments Vercel offers (Production, Preview,
Development) unless you specifically want different Firebase projects per
environment.

### 4. Deploy

Click **Deploy**. You'll get a URL like `https://<project-name>.vercel.app`
— this is the temporary URL for development, testing, and college
approval, exactly as the original brief specified. No domain purchase
needed to reach this point.

### 5. Test the deployed site

Beyond the Phase 11 checklist (which was written against `localhost`, but
applies identically here):

- [ ] Visit the deployed URL — Home loads correctly
- [ ] Click into Companies, then a specific company's detail page, then
      **refresh the browser** on that detail page — this is the exact
      scenario `vercel.json` fixes; if it 404s, that file didn't get
      picked up (check it's at the project root, not inside `src/`)
- [ ] Visit `/admin/login` directly (not via a link, since there isn't one
      — see "Hidden admin login") and confirm you can sign in
- [ ] Confirm real-time updates still work in production: add a company
      in the admin panel, check that the public site reflects it without
      a manual reload
- [ ] Quick mobile check on an actual phone or browser DevTools' device
      toolbar: the admin sidebar should collapse into a hamburger menu
      below the `md` breakpoint (see "Mobile & tablet responsiveness" above)

### 6. Connecting a custom domain (once the college owns one)

Not assuming any particular domain, per the original brief. When ready:

1. Vercel project → **Settings → Domains** → add the domain
2. Vercel will show specific DNS records to add (usually an `A` record or
   `CNAME`, depending on whether it's an apex domain or a subdomain) —
   these are generated per-domain, so there's nothing to pre-configure
   here
3. Add those records at wherever the domain is registered (the college's
   registrar, not Vercel) — **I won't make DNS changes automatically**,
   per the original brief; this is a step for whoever manages the
   college's domain registration
4. Once DNS propagates, Vercel issues an HTTPS certificate automatically

## Handover notes

For whoever ends up running this day-to-day (per the original brief's
handover requirements):

- **Public site:** `https://<whatever-vercel-or-custom-domain>`
- **Admin login:** `<same domain>/admin/login` — not linked from
  anywhere on the site (see "Hidden admin login"), so this URL needs to
  be given directly to whoever administers it
- **Day-to-day admin tasks** (adding a company, closing a drive, posting
  an announcement, editing contact info) are all covered by the Phase
  5-9 sections above, and require zero code changes — that was the
  point of building the CMS this way
- **Account ownership:** per the original brief, I'm not handing over any
  of my own credentials, and the college should ideally own its own
  production accounts (GitHub org, Vercel team, Firebase project) rather
  than depending on a developer's personal ones long-term. If this
  project was built under your own personal accounts so far, consider
  transferring ownership (Firebase supports transferring project
  ownership; GitHub supports transferring repo ownership; Vercel
  supports transferring projects to a team) before treating this as a
  long-term production deployment.

## Known Items for Later

- **Bundle size:** the production JS bundle is now ~940KB (mostly Firebase's
  full SDK + GSAP). Not a problem functionally, but Phase 39 (Performance)
  in the original plan is where this gets addressed — likely via dynamic
  `import()` for the admin bundle (public visitors shouldn't download admin
  code) and Firebase's modular imports being tree-shaken more aggressively.
