import React from 'react'
import { logout } from '../../redux/slices/authSlice'
import { Hourglass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

const BannedPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }
  return (
    <div className='pending-wrap'>
      <div className='pending-card'>
        <div className='pending-icon'>
          <Hourglass size={48} strokeWidth={1.5} color="var(--brand)" />
        </div>
        <div className='pending-title'>Your account has been suspended</div>
        <div className='pending-desc'>
          Your account has been suspended due to some reasons. 
        </div>
        <div style={{ fontSize: '13px', color: 'var(--subtle)', marginBottom: '24px' }}>
          Contact us at: <strong style={{ color: 'var(--ink)' }}>ssali71173@gmail.com</strong> and try to Login again
        </div>
        <button className='auth-btn' style={{ maxWidth: '200px', margin: '0 auto' }} onClick={handleLogout}>
          Login Again
        </button>
      </div>  
    </div>
  )
}

export default BannedPage