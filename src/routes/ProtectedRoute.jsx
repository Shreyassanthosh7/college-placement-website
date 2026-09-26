import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Guards /admin/* routes. This is a UI convenience only — the real security
 * boundary is Firestore/Storage Security Rules (Phase 10), which enforce
 * the same users/{uid}.role === "ADMIN" check server-side regardless of
 * what this component does. Never treat this as sufficient protection on
 * its own.
 */
export default function ProtectedRoute({ children }) {
  const { status, isAdmin } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Checking admin access…</p>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return children
}
