'use client'

import { usersApi } from '@/api/users'
import { useStore } from '@/store'
import { Profile } from '@/types/api'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

// 인증 컨텍스트 타입
interface AuthContextType {
  isAuthenticated: boolean
  isAdmin: boolean
  user: Profile | null
}

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
})

// 컨텍스트 사용을 위한 훅
export const useAuthContext = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // zustand 스토어에서 인증 상태 가져오기
  const { auth, user } = useStore()
  const router = useRouter()
  const pathname = usePathname()

  // 로딩상태
  const [isLoading, setIsLoading] = useState(true)

  const authCheckRef = useRef(false)

  // 페이지 접근 설정
  const adminPages = ['/admin/user', '/admin/letter', '/admin/letter/:id']
  const authPages = ['/my-letter', '/letter-ask']
  const guestPages = ['/login']

  // 인증 상태 확인 (최초 1회 실행)
  useEffect(() => {
    // 이미 확인한 경우 스킵
    if (authCheckRef.current) {
      setIsLoading(false)
      return
    }

    async function checkAuthStatus() {
      try {
        console.log('인증 상태 확인 중(최초 1회)')

        // 이미 스토어에 정보가 있는 경우 확인 스킵
        if (auth.isAuthenticated && user.user) {
          return
        }

        // 스토어에 정보가 없는 경우 사용자 정보 조회
        try {
          const userProfile = await usersApi.getUser()

          // 유저 정보가 있으면 인증된 상태로 간주
          if (userProfile) {
            auth.setAuthenticated(true)

            // 관리자 권한 확인
            if (userProfile.isAdmin) {
              auth.setAdmin(true)
            }

            // 사용자 정보 저장
            user.setUser(userProfile)
          }
        } catch (error) {
          console.log('인증 확인 중 오류 또는 인증되지 않음')
          // 오류 발생 시 비인증 상태로 처리
          auth.setAuthenticated(false)
          auth.setAdmin(false)
          user.setUser(null)
        }
      } finally {
        authCheckRef.current = true
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // 접근 제어 로직 (로딩 상태가 아닐 때만 실행)
  useEffect(() => {
    if (isLoading) {
      return
    }

    // 관리자 페이지 접근 제어
    if (adminPages.some((page) => pathname?.startsWith(page))) {
      if (!auth.isAuthenticated) {
        router.push('/admin')
        return
      }
      if (!auth.isAdmin) {
        router.push('/')
        return
      }
    }

    // 인증 필요 페이지 접근 제어
    if (authPages.some((page) => pathname?.startsWith(page))) {
      if (!auth.isAuthenticated) {
        router.push('/login')
        return
      }
    }

    // 로그인 페이지 접근 제어
    if (guestPages.some((page) => pathname === page)) {
      if (auth.isAuthenticated) {
        router.push('/my-letter')
        return
      }
    }
  }, [isLoading, auth.isAuthenticated, auth.isAdmin, pathname, router])

  // 로딩 표시
  if (isLoading) {
    return <div>Loading...</div>
  }

  // 컨텍스트 값
  const value = {
    isAuthenticated: auth.isAuthenticated,
    isAdmin: auth.isAdmin,
    user: user.user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
