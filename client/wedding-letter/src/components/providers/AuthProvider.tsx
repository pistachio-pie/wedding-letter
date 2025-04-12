'use client'

import { getAccessToken } from '@/lib/auth'
import { useAuthStore } from '@/store/auth'
import { useEffect } from 'react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuthenticated, setUser } = useAuthStore()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getAccessToken()
        if (token) {
          setAuthenticated(true)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setAuthenticated(false)
        setUser(null)
      }
    }
    checkAuth()
  }, [])

  return <>{children}</>
}
