'use client'

import { usersApi } from '@/api/users'
import useSWR from 'swr'
import { useStore } from '@/store'
import { useEffect, useState } from 'react'
import { Role } from '@/types/api/common'

export function useProfile() {
  const { auth, user: userStore } = useStore()
  const isAuthenticated = auth.isAuthenticated

  // 로컬 상태 관리
  const [profileError, setProfileError] = useState<Error | null>(null)

  // 캐시된 사용자 데이터 확인
  const cachedUser = userStore.user

  // 키 생성 함수 - 인증 상태에 따라 조건부 요청
  const getKey = () => {
    if (!isAuthenticated) return null
    return ['profile']
  }

  const { data, error, isLoading, mutate } = useSWR(
    getKey(),
    async () => {
      try {
        // 이미 스토어에 프로파일이 있다면 재사용
        if (cachedUser && Object.keys(cachedUser).length > 0) {
          return cachedUser
        }

        // 없으면 api 요청
        const profileData = await usersApi.getUser()

        // 스토어 업데이트
        userStore.setUser(profileData.data)
        if (profileData.data.role === Role.ADMIN) {
          auth.setAdmin(true)
        }

        return profileData
      } catch (error) {
        console.error('사용자 정보 가져오기 실패', error)
        setProfileError(error as Error)

        if ((error as any).response?.status === 401) {
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
        }

        throw error
      }
    },
    {
      dedupingInterval: 30000, // 30초 동안 중복 요청 방지
      errorRetryCount: 2,
      // 에러 발생 시 처리
      // 인증 상태 초기화 처리
      onError: (error) => {
        console.error('사용자 정보 가져오기 실패', error)

        // 인증 오류 시 인증상태 초기화(로그아웃 처리)
        if ((error as any).response?.status === 401) {
          auth.setAuthenticated(false)
          userStore.setUser(null)
        }
      },
    },
  )

  // 인증 상태 변경 모니터링
  useEffect(() => {
    if (isAuthenticated) {
      mutate()
      // 인증 상태 변경 시 데이터 재요청
    }
  }, [isAuthenticated, mutate])

  // 사용자 로그아웃 시 캐시 정리
  useEffect(() => {
    if (!isAuthenticated && data) {
      // 데이터는 있지만 인증이 해제된 상태
      mutate(undefined, false) // 로컬 데이터만 null로 업데이트 (API 요청 없음)
    }
  }, [isAuthenticated, data, mutate])

  // 수동으로 사용자 정보 갱신이 필요할 때: 새로고침
  const refreshProfile = () => {
    return mutate()
  }

  // 프로필 업데이트 함수
  // const updateProfile = async (profileData: Partial<Profile>) => {
  //   try {
  //     const updatedProfile = await userApi.updateProfile(profileData)

  // 로컬 데이터 먼저 업데이트 후 백그라운드에서 재검증
  //     mutate(updatedProfile, false)

  //     return updatedProfile
  //   } catch (error) {
  //     console.error('프로필 업데이트 실패:', error)
  //     throw error
  //   }
  // }

  return {
    profile: data,
    isLoading,
    isError: !!error || !!profileError,
    error: error || profileError,
    refreshProfile,
    // updateProfile,
  }
}
