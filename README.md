# College Placement Cell Website

A responsive placement portal for students and recruiters, with a secure admin dashboard for Placement Cell staff. Students can explore companies, placement drives, and announcements, then apply through each company's official application form. Staff manage the site's content in Firebase without changing code.

![College Placement Cell logo](src/assets/logo.png)

## Features

- **Public website:** Home, About, Companies, Company Details, Upcoming Drives, Previous Drives, Announcements, and Contact pages.
- **Placement listings:** Company and drive information is loaded from Firestore. Draft content stays private; public pages show only the appropriate published or active records.
- **Applications:** Company application links can send students to an external Google Form.
- **Admin dashboard:** Firebase email/password sign-in with an additional Firestore admin-role check.
- **Content management:** Create, edit, publish, and manage companies, drives, and announcements; manage placement records, team details, site settings, and archived items.
- **Live updates:** Firestore subscriptions keep supported public content and settings current without a page reload.
- **Responsive and accessible UI:** Mobile navigation and layouts, with animations that respect reduced-motion preferences.

## Tech Stack

- React 19, Vite, and React Router
- Tailwind CSS v4
- Firebase Authentication and Cloud Firestore
- GSAP for motion
- Vercel for hosting

## Run Locally

### Requirements

- Node.js and npm
- A Firebase project with a Web App, Authentication, and Cloud Firestore configured

### Setup

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/<your-username>/<your-repository>.git
   cd <your-repository>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local environment file and add your Firebase Web App values:

   ```bash
   cp .env.example .env
   ```

   Set these variables in `.env`:

   ```dotenv
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```

   Find the values in **Firebase Console → Project settings → General → Your apps → Web app**. `VITE_FIREBASE_MEASUREMENT_ID` is optional and only needed if Firebase Analytics is configured. This project does not use Firebase Storage.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open the local URL printed by Vite (usually `http://localhost:5173`).

## Firebase and Admin Setup

The public site needs a Firebase project configured before it can load. To enable the admin dashboard:

1. In Firebase Authentication, enable **Email/Password** sign-in.
2. Create a **Cloud Firestore** database.
3. Publish the rules in [`firestore.rules`](firestore.rules) from **Firestore Database → Rules**. These rules control public reads, validate content writes, and restrict admin and student placement data.
4. Create an admin account under **Authentication → Users** and copy its UID.
5. In Firestore, create a `users` collection document whose document ID is that UID. Add these fields:

   | Field | Type | Example |
   | --- | --- | --- |
   | `name` | string | `Placement Administrator` |
   | `email` | string | `admin@example.edu` |
   | `role` | string | `ADMIN` |

6. Sign in at `/admin/login` with that account.

The app checks both Firebase Authentication and the matching `users/{uid}` document with `role: "ADMIN"`. A signed-in account without that Firestore role is not granted admin access. User profile documents are created manually in Firebase; client-side writes to `users` are denied by the rules.

## Deploy to Vercel

1. Push this repository to GitHub and import it into Vercel.
2. Set the build command to `npm run build` and the output directory to `dist` (Vercel usually detects Vite automatically).
3. Add the `VITE_FIREBASE_*` variables listed above in the Vercel project's environment variable settings. Add them to each deployment environment you use.
4. Deploy the project. The included [`vercel.json`](vercel.json) rewrites app routes to `index.html`, so direct visits and refreshes on routes such as `/companies` and `/admin/login` work with the client-side router.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Vite development server. |
| `npm run build` | Create the production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run Oxlint on the project. |

## Project Structure

```text
src/
├── admin/       Admin pages and content forms
├── assets/      Logo and other local assets
├── components/  Shared UI components
├── context/     Authentication, settings, and notification state
├── firebase/    Firebase app, Auth, and Firestore setup
├── hooks/       Shared React hooks
├── layouts/     Public and admin page layouts
├── pages/       Public website pages
├── routes/      Protected route handling
├── services/    Firestore data operations
└── utils/       Validation and formatting helpers

firestore.rules  Firestore access rules and write validation
vercel.json      Single-page app route rewrite for Vercel
```

## Security Notes

- `.env` is gitignored. Keep local environment files out of commits, and configure deployment values in Vercel.
- Firebase Web App configuration is included in the browser bundle; it is not a private credential. Firestore Security Rules and Firebase Authentication enforce access.
- Never put service-account keys, private keys, or other server credentials in `VITE_*` variables or frontend code.
- Review and publish `firestore.rules` in your own Firebase project before using the admin tools.
