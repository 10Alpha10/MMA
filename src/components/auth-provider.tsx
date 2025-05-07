'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { setCookie, getCookie, deleteCookie } from 'cookies-next'

type AuthContextType = {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const hasAuth = getCookie('currentUser')
    setIsAuthenticated(!!hasAuth)
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const login = async (email: string, password: string) => {
    try {
      // Get stored users (this should eventually be replaced with a real API call)
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find((u: { email: string; password: string }) => u.email === email)
      
      if (!user || user.password !== password) {
        return false
      }
      
      // Set cookie and update state
      setCookie('currentUser', JSON.stringify({ email: user.email }))
      setIsAuthenticated(true)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    deleteCookie('currentUser')
    setIsAuthenticated(false)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
