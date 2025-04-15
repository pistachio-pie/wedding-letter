'use client'
// 관리자 계정 생성 및 로그인, 로그아웃
import { authApi } from '@/api/auth'
import { useStore } from '@/store'
import { AdminRequest } from '@/types/api/auth'
import { useState } from 'react'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { auth, user } = useStore()

  // 관리자 계정 생성
  const registAdmin = async (requestData: AdminRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.registAdmin(requestData)

      if (response.success) {
        return true
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      setError(error.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // 관리자 계정 로그인
  const loginAdmin = async (requestData: AdminRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authApi.loginAdmin(requestData)

      if (response.success) {
        auth.setAuthenticated(true)
        auth.setAdmin(response.user.isAdmin)
        return true
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      setError(error.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // 로그아웃
  // api는 없지만 토큰 삭제 처리
  const logout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      auth.logout()
      return true
    } catch (error: any) {
      setError(error.message)
      // api 오류가 발생해도 클라이언트 측에서는 로그아웃 처리
      auth.logout()
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // 필요 시 토큰 검증 함수 추가

  return {
    // 인증 상태
    isAuthenticated: auth.isAuthenticated,
    isAdmin: auth.isAdmin,
    isLoading,
    error,

    // 인증 액션
    registAdmin,
    loginAdmin,
    logout,
  }
}
