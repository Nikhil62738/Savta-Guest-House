import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Attach JWT (set by admin login) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sawta_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && localStorage.getItem('sawta_token')) {
      localStorage.removeItem('sawta_token')
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api

// Convenience constants pulled from env
export const WHATSAPP = import.meta.env.VITE_WHATSAPP || '919876543210'
export const MAPS_EMBED =
  import.meta.env.VITE_MAPS_EMBED ||
  'https://www.google.com/maps?q=Maharashtra%20India&output=embed'
