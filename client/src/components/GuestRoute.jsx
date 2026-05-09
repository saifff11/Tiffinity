import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function GuestRoute({ children }) {
  const { user, token } = useSelector((state) => state.auth)

  if (token && user) {
    if (user.role === 'cook') return <Navigate to='/cook/dashboard' />
    if (user.role === 'admin') return <Navigate to='/admin/dashboard' />
    return <Navigate to='/home' />
  }

  return children
}

export default GuestRoute