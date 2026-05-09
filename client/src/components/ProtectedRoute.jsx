import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, roles }) {
  const { user, token, isBanned } = useSelector((state) => state.auth)

  // Not logged in
  if (!token || !user) return <Navigate to='/login' />

  // Banned user
  if (isBanned || !user.isActive) return <Navigate to='/banned' />

  // Role-based access control
  if (roles && !roles.includes(user.role)) {
    if (user.role === 'cook') return <Navigate to='/cook/dashboard' />
    if (user.role === 'admin') return <Navigate to='/admin/dashboard' />
    return <Navigate to='/home' />
  }

  return children
}

export default ProtectedRoute