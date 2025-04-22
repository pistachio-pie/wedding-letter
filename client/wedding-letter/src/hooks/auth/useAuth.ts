'use client'

import { authApi } from '@/api/auth'
import { useStore } from '@/store'
import { useState } from 'react'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { auth } = useStore()

  // kakao 로그아웃
  const kakaoLogout = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await authApi.logoutKakao()
      auth.logout()
    } catch (error) {
      setError(error as Error)
      // api 오류가 발생해도 클라이언트 측에서는 로그아웃 처리
      auth.logout()
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    kakaoLogout,
    isLoading,
    error,
  }
}
