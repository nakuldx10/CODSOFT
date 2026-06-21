import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

// Attach token from window global
axiosInstance.interceptors.request.use(config => {
  const token = window.__hirehub_token__
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

// Handle 401 — refresh token
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config

    if (!error.response) {
      return Promise.reject(new Error('Cannot connect to server. Make sure backend is running on port 5000.'))
    }

    // Prevent infinite loop if refresh token request itself fails
    if (original.url.includes('/api/auth/refresh') || original.url.includes('/api/auth/login') || original.url.includes('/api/auth/register')) {
      return Promise.reject(error)
    }

    if (error.response.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          original.headers['Authorization'] = `Bearer ${token}`
          return axiosInstance(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const res = await axiosInstance.get('/api/auth/refresh')
        const newToken = res.data.accessToken
        window.__hirehub_token__ = newToken
        processQueue(null, newToken)
        original.headers['Authorization'] = `Bearer ${newToken}`
        return axiosInstance(original)
      } catch (err) {
        processQueue(err, null)
        window.__hirehub_token__ = null
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
