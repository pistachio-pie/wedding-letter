'use client'

import { useStore } from '@/store'
import { Profile } from '@/types/api'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

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

  // 페이지 접근 설정
  const adminPages = ['/admin/user', '/admin/letter', '/admin/letter/:id']
  const authPages = ['/my-letter', '/letter-ask']
  const guestPages = ['/login']

  // 접근 제어 로직
  useEffect(() => {
    // 앱 초기화 시 인증 상태 체크 로직을 여기에 추가할 수 있음
    setIsLoading(false)

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
  }, [auth.isAuthenticated, auth.isAdmin, pathname, router])

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
