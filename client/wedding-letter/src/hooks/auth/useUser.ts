'use client'

import { usersApi } from '@/api/users'
import { Profile, User } from '@/types/api'
import useSWR from 'swr'
import { useStore } from '@/store'

export function useUser() {
  const { auth, user } = useStore()

  // SWR로 사용자 정보 가져오기
  // provider에서 제공하는 fetcher 사용(생략 가능)
  const { data, error, isLoading, mutate } = useSWR<Profile>(
    // 조건부로 키 설정 (null이면 fetch 안함)
    auth.isAuthenticated ? '/api/users/profile' : null,
    async (url: string) => {
      try {
        return await usersApi.getUser()
      } catch (error) {
        console.error('사용자 정보 가져오기 실패', error)
        throw error
      }
    },
    {
      // 에러 발생 시 처리
      // 인증 상태 초기화 처리
      onError: (error) => {
        console.error('사용자 정보 가져오기 실패', error)
        auth.setAuthenticated(false)
        user.setUser(null)
      },
      // 성공 시 처리
      // zustand에 저장
      onSuccess: (data) => {
        if (data) {
          user.setUser(data)
          auth.setAuthenticated(true)
        }
      },
      dedupingInterval: 60000, // 1분 동안 중복 요청 방지
    },
  )

  // 사용자 정보 업데이트 함수
  // api 없음
  // 수동으로 사용자 정보 갱신이 필요할 때: 새로고침
  const refreshUserInfo = async () => await mutate()

  return {
    // 상태
    user: data || null,
    isLoading,
    isError: error,

    // 액션
    refreshUserInfo,
    setUser: user.setUser,
  }
}
