import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axiosInstance from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)

  const setAuth = (token, userData) => {
    setAccessToken(token)
    setUser(userData)
    window.__hirehub_token__ = token
  }

  const clearAuth = () => {
    setAccessToken(null)
    setUser(null)
    window.__hirehub_token__ = null
  }

  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/api/auth/refresh')
      setAuth(res.data.accessToken, res.data.user)
      return res.data.accessToken
    } catch {
      clearAuth()
      return null
    }
  }, [])

  useEffect(() => {
    refreshAccessToken().finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post('/api/auth/login', { email, password })
      setAuth(res.data.accessToken, res.data.user)
      return res.data.user
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const register = async (name, email, password, role) => {
    try {
      const res = await axiosInstance.post('/api/auth/register', { name, email, password, role })
      setAuth(res.data.accessToken, res.data.user)
      return res.data.user
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  const logout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout')
    } catch {}
    clearAuth()
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      accessToken, 
      loading, 
      isAuthenticated: !!user,
      login, 
      register, 
      logout, 
      refreshAccessToken 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export default AuthContext
