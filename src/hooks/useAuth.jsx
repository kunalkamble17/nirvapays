import { useState, useEffect, createContext, useContext } from 'react'
import { addCustomer, getCustomerByEmail, getStaffByEmail } from '../utils/mockStore'

const AuthContext = createContext(null)

const normalizeUser = (u) => {
  if (!u) return null
  const role = u.role ? String(u.role).toLowerCase() : undefined
  const name = u.name || u.profile?.fullName || u.fullName || u.email
  return { ...u, role, name }
}

const AUTH_MODE = 'mock'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        const storedUserRaw = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (storedUserRaw) {
          setUser(normalizeUser(JSON.parse(storedUserRaw)))
        }

      } catch {
        if (!cancelled) {
          setUser(null)
        }
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  const login = async (email, password) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 250))

      const emailNormalized = String(email || '').trim().toLowerCase()
      const staff = getStaffByEmail(emailNormalized)
      const customer = getCustomerByEmail(emailNormalized)
      const account = staff || customer
      const expectedPassword = String(account?.password || 'password')

      if (!account || String(password || '') !== expectedPassword) {
        return { success: false, error: 'Invalid credentials' }
      }

      const userObj = staff ? { ...staff } : { ...customer, role: 'customer', name: customer.fullName }

      const token = `mock-token-${Date.now()}`
      const normalized = normalizeUser(userObj)
      setUser(normalized)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(normalized))
      return { success: true, user: normalized }
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const register = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 250))
      const created = addCustomer(data || {})
      const normalized = normalizeUser({ ...created, role: 'customer', name: created.fullName })

      const token = `mock-token-${Date.now()}`
      setUser(normalized)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(normalized))

      return { success: true, user: normalized }
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export { AuthProvider as default }
