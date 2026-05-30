import { createContext, useContext, useState } from 'react'
import API from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ks_user')) } catch { return null }
  })

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password })
    localStorage.setItem('ks_token', data.token)
    localStorage.setItem('ks_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async (name, email, password, phone, role) => {
    const { data } = await API.post('/auth/register', { name, email, password, phone, role })
    localStorage.setItem('ks_token', data.token)
    localStorage.setItem('ks_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('ks_token')
    localStorage.removeItem('ks_user')
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const { data } = await API.get('/auth/me')
      localStorage.setItem('ks_user', JSON.stringify(data.user))
      setUser(data.user)
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
