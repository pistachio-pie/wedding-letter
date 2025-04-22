'use client'

import { authApi } from '@/api/auth'
import useStore from '@/store/useStore'
import { AdminRequest } from '@/types/api/auth'
import { useState } from 'react'
import { useSWRConfig } from 'swr'

export function useAdmin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { mutate } = useSWRConfig()
  const { auth } = useStore()

  // 관리자 계정 생성
  const registAdmin = async (requestData: AdminRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.registAdmin(requestData)

      return response
    } catch (error) {
      setError(error as Error)
      throw error
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

      // zustand 스토어 업데이트
      auth.setAuthenticated(true)
      auth.setAdmin(true)

      mutate('profile')

      return response
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 관리자 로그아웃
  const logout = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await authApi.logout()

      // zustand 스토어 업데이트
      auth.setAuthenticated(false)
      auth.setAdmin(false)

      mutate('profile')
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    registAdmin,
    loginAdmin,
    logout,
    isLoading,
    error,
  }
}
