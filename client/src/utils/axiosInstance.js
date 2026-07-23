import axios from 'axios'
import store from '../redux/store'
import { setBanned } from '../redux/slices/authSlice'

const getApiBaseUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  return rawUrl.split('||')[0].trim().replace(/\/$/, '')
}

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
})

// Automatically attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response?.status === 403 &&
      error.response?.data?.message === 'Your account has been suspended'
    ) {
      store.dispatch(setBanned())
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
