'use client'

import { authApi } from '@/api/auth'
import { AdminRequest } from '@/types/api/auth'
import { useState } from 'react'
import { useSWRConfig } from 'swr'

export function useAdmin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { mutate } = useSWRConfig()

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
