'use client'

import { usersApi } from '@/api/users'
import { useStore } from '@/store'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Success() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loginProcessed, setLoginProcessed] = useState(false)

  // 스토어에서 인증 상태 관리 함수 가져오기
  const { auth, user } = useStore()

  useEffect(() => {
    // 이미 처리된 경우 스킵
    if (loginProcessed) {
      return
    }

    async function processLogin() {
      try {
        const token = searchParams.get('token')
        console.log('token', token)

        // 토큰 유무와 상관없이 사용자 정보 조회 시도
        try {
          const userProfile = await usersApi.getUser()

          // 스토어 업데이트
          auth.setAuthenticated(true)

          if (userProfile.data.role === 'ADMIN') {
            auth.setAdmin(true)
          }

          user.setUser(userProfile.data)

          console.log('로그인 성공')
          router.push('/')
        } catch (apiError) {
          console.error('사용자 정보 조회 실패', apiError)
          setError('사용자 정보 조회 실패')

          router.push('/login')
        }
      } catch (error) {
        console.error('로그인 실패', error)
        setError('로그인 실패')
      } finally {
        setIsLoading(false)
        setLoginProcessed(true)
      }
    }

    processLogin()
  }, [])

  if (isLoading) {
    return <div>로딩중...</div>
  }

  if (error) {
    return (
      <div>
        <div className='text-red-500'>{error}</div>
        <div>잠시 후 로그인 페이지로 이동합니다.</div>
      </div>
    )
  }

  return <div>로그인 성공</div>
}
