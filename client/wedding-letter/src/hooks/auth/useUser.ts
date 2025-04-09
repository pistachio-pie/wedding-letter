'use client'

import { authApi } from '@/api/auth'
import { getAccessToken } from '@/lib/auth'
import { useAuthStore } from '@/store/auth'
import { User } from '@/types/api'
import useSWR from 'swr'

export function useUser() {
  const { setUser, setAuthenticated, logout: clearAuth } = useAuthStore()

  // SWR로 사용자 정보 가져오기
  // provider에서 제공하는 fetcher 사용(생략 가능)
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<User>(
    // 조건부로 키 설정 (null이면 fetch 안함)
    getAccessToken() ? '/api/users/profile' : null,
    {
      // 에러 발생 시 처리
      onError: (error) => {
        console.error('사용자 정보 가져오기 실패', error)
        clearAuth()
      },
      // 성공 시 처리
      // zustand에 저장
      onSuccess: (data) => {
        if (data) {
          // roll 값 일시적으로 1로 설정
          // 추후 백엔드에서 정확한 값 받아오면 삭제 필요
          setUser({ ...data, roll: 1 })
          setAuthenticated(true)
        }
      },
    },
  )

  // 로그아웃 함수
  const logout = async () => {
    try {
      // useSWR은 데이터 조회와 캐시 관리용
      // 로그아웃은 변경 및 일회성 작업으로 useSWR을 사용할 필요없음
      // 따라서 직접 api 호출 처리
      await authApi.logout()

      // zustand에서 사용자 정보 초기화
      clearAuth()

      // SWR 캐시 초기화
      await mutate(undefined)
    } catch (error) {
      console.error('로그아웃 에러', error)
      throw error
    }
  }

  // 수동으로 사용자 정보 갱신이 필요할 때: 새로고침
  const refreshUserInfo = () => mutate()

  // 로그인 성공 여부만 확인하는 함수
  const checkLoginStatus = () => {
    return !!getAccessToken() && !!userData
  }

  return {
    user: userData,
    isLoading: !userData && !error,
    isError: error,
    logout,
    refreshUserInfo,
    checkLoginStatus,
  }
}
