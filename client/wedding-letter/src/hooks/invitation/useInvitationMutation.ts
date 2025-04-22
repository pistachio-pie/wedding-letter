'use client'

import { invitationApi } from '@/api/invitation'
import { InvitationDetailRequest } from '@/types/api/invitation'
import { useState } from 'react'
import { useSWRConfig } from 'swr'

export function useInvitationMutation() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { mutate } = useSWRConfig()

  // 초대장 생성
  const createInvitation = async (data: InvitationDetailRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await invitationApi.createInvitation(data)
      // 목록 캐시 무효화
      mutate((cacheKey: string) => Array.isArray(cacheKey) && cacheKey[0] === 'invitations')
      mutate((cacheKey: string) => Array.isArray(cacheKey) && cacheKey[0] === 'invitationsByUserId')

      return response
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 초대장 수정
  const updateInvitation = async (id: number | null, data: InvitationDetailRequest) => {
    if (!id) throw new Error('id is required')
    setIsLoading(true)
    setError(null)
    try {
      const response = await invitationApi.updateInvitation(id, data)
      // 관련 캐시 무효화
      mutate('invitationById', id)
      mutate((cacheKey: string) => Array.isArray(cacheKey) && cacheKey[0] === 'invitations')
      mutate((cacheKey: string) => Array.isArray(cacheKey) && cacheKey[0] === 'invitationsByUserId')

      return response
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 초대장 소프트 삭제
  const softDeleteInvitation = async (id: number | null) => {
    if (!id) throw new Error('id is required')
    setIsLoading(true)
    setError(null)
    try {
      await invitationApi.softDeleteInvitation(id)
      // 관련 캐시 무효화
      mutate(['invitationById', id], null)
      mutate((cacheKey: string) => Array.isArray(cacheKey) && cacheKey[0] === 'invitations')
      mutate((cacheKey: string) => Array.isArray(cacheKey) && cacheKey[0] === 'invitationsByUserId')
      mutate((cacheKey: string) => Array.isArray(cacheKey) && cacheKey[0] === 'deletedInvitations')
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 초대장 영구 삭제
  const hardDeleteInvitation = async (id: number | null) => {
    if (!id) throw new Error('id is required')
    setIsLoading(true)
    setError(null)
    try {
      await invitationApi.hardDeleteInvitation(id)
      // 관련 캐시 무효화
      mutate(['invitationById', id], null)
      mutate((cacheKey: string) => Array.isArray(cacheKey) && cacheKey[0] === 'deletedInvitations')
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 초대장 복구
  const restoreInvitation = async (id: number | null) => {
    if (!id) throw new Error('id is required')
    setIsLoading(true)
    setError(null)
    try {
      const response = await invitationApi.restoreInvitation(id)
      // 관련 캐시 무효화
      mutate(['invitationById', id], null)
      mutate((cacheKey: string) => Array.isArray(cacheKey) && cacheKey[0] === 'invitations')
      mutate((cacheKey: string) => Array.isArray(cacheKey) && cacheKey[0] === 'invitationsByUserId')
      mutate((cacheKey: string) => Array.isArray(cacheKey) && cacheKey[0] === 'deletedInvitations')

      return response
    } catch (error) {
      setError(error as Error)
      throw error
    }
  }

  return {
    createInvitation,
    updateInvitation,
    softDeleteInvitation,
    hardDeleteInvitation,
    restoreInvitation,
    isLoading,
    error,
  }
}
