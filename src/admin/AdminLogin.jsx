import { useState } from 'react'
import { useLocation, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import logo from '../assets/logo.png'
import AuroraBackground from '../components/AuroraBackground'

export default function AdminLogin() {
  const { signIn, signOut, isAdmin, status, firebaseUser, error } = useAuth()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  // Already confirmed as an admin — redirect. This is intentionally the
  // ONLY place navigation to the dashboard happens: it's driven by the
  // actual isAdmin value from context, not by "signIn() resolved" timing.
  // Navigating imperatively right after signIn() would race against the
  // async users/{uid} role lookup in AuthContext and could send someone to
  // /admin/dashboard before authorization was confirmed, only for
  // ProtectedRoute to immediately bounce them back here.
  if (status === 'signed-in' && isAdmin) {
    const redirectTo = location.state?.from?.pathname || '/admin/dashboard'
    return <Navigate to={redirectTo} replace />
  }

  // Still resolving Firebase's auth state (either on first load, or right
  // after a successful sign-in while the admin-role lookup is in flight).
  // Showing nothing here previously meant the form would just silently
  // sit there for a moment, or flash back to itself — looked broken even
  // when it wasn't.
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Checking admin access…</p>
      </div>
    )
  }

  // Signed in to Firebase successfully, but not an authorized admin — either
  // no users/{uid} document exists yet, or its role isn't "ADMIN". This used
  // to fail silently (the form would just reappear with no explanation).
  // Common cause: the "Create your first admin" Firestore doc from the
  // README hasn't been created yet, or firestore.rules hasn't been
  // published, so the role lookup itself was denied. That detail stays in
  // the browser console (see AuthContext.jsx) rather than on this screen —
  // whoever lands here sees a plain, non-technical message instead of
  // Firestore schema/rules internals.
  if (status === 'signed-in' && !isAdmin) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <AuroraBackground />
        <div className="relative w-full max-w-sm glass rounded-2xl p-8 text-center">
          <h1 className="font-display text-lg font-bold mb-2">Not authorized as admin</h1>
          <p className="text-sm text-muted-foreground mb-1">
            Signed in as <span className="font-medium text-foreground">{firebaseUser?.email}</span>, but
            this account isn't set up as a Placement Cell admin.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            {error || 'Please contact the site administrator for access.'}
          </p>
          <button
            type="button"
            onClick={signOut}
            className="btn-outline-gold rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            Sign out and try another account
          </button>
          <div className="mt-4">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)
    try {
      await signIn(email, password)
      // Do NOT navigate here. signIn() only confirms Firebase Auth
      // succeeded — the users/{uid} admin-role lookup that AuthContext
      // kicks off in response is still in flight. The status==='loading'
      // and status==='signed-in'&&isAdmin branches above react to that
      // once it resolves, whichever way it goes.
    } catch (err) {
      // signIn() already maps this to a friendly message — never show
      // err.code or Firebase's raw error text to the user.
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <AuroraBackground />

      <Link
        to="/"
        className="glass glow-on-hover absolute top-5 left-5 z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Home
      </Link>

      <div className="relative w-full max-w-sm glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src={logo} alt="TNDALU Placement Cell seal" className="w-10 h-10 rounded-full object-contain" />
          <div>
            <h1 className="font-display text-lg font-bold leading-tight">Admin Login</h1>
            <p className="text-xs text-muted-foreground leading-tight">Placement Cell staff only</p>
          </div>
        </div>

        {formError && (
          <div
            role="alert"
            className="mb-4 rounded-lg px-3 py-2 text-sm"
            style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="w-full rounded-lg glass px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 disabled:opacity-60"
              style={{ outlineColor: 'var(--color-ring)' }}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              className="w-full rounded-lg glass px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 disabled:opacity-60"
              style={{ outlineColor: 'var(--color-ring)' }}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="glow-on-hover w-full rounded-full py-2.5 font-semibold transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          No public registration. Admin accounts are created directly in Firebase
          Console by the site owner.
        </p>
      </div>
    </div>
  )
}
