import { Navigate, useLocation } from 'react-router-dom'

// Guards admin routes — redirects to /admin/login when no JWT is present.
export default function RequireAuth({ children }) {
  const location = useLocation()
  const token = localStorage.getItem('sawta_token')
  if (!token) {
    const redirectState = { from: location.pathname }
    return <Navigate to="/admin/login" state={redirectState} replace />
  }
  return children
}
