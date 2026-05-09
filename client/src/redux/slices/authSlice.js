import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  resetSession: false,
  isBanned: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    // For password reset flow
    startResetFlow: (state) => {
      state.resetSession = true
    },
    // Clear reset flow after completion or cancellation
    clearResetFlow: (state) => {
      state.resetSession = false
    },
    setBanned: (state) => {
      state.isBanned = true
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isBanned = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})

export const { setCredentials, setLoading, setError, startResetFlow, clearResetFlow, logout, setBanned } = authSlice.actions
export default authSlice.reducer