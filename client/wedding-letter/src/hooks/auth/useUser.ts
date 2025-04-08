import { authApi } from '@/api/auth'
import { getAccessToken } from '@/lib/auth'
import { useAuthStore } from '@/store/auth'
import { User } from '@/types/api'
import useSWR from 'swr'

export function useUser() {
  const { setUser, setAuthenticated, logout: clearAuth } = useAuthStore()

  // SWR로 사용자 정보 가져오기
  const { data: userData, error, mutate } = useSWR<User>('/api/users/profile', authApi.getUser)

  // 로그인 함수
  const login = async () => {
    try {
      const token = getAccessToken()

      if (!token) {
        throw new Error('로그인 실패: 토큰이 존재하지 않습니다')
      }
      // zustand에 저장
      setUser(userData ?? null)
      setAuthenticated(true)

      // SWR 캐시 업데이트
      await mutate()

      return userData
    } catch (error) {
      console.error('로그인 에러', error)
      throw error
    }
  }

  // 로그아웃 함수
  const logout = async () => {
    try {
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

  return {
    user: userData,
    isLoading: !userData && !error,
    isError: error,
    login,
    logout,
  }
}

//const { user, isLoading, isError } = useUser(userId) 사용할때
