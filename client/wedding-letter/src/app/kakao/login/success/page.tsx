'use client'

import { usersApi } from '@/api/users'
import { useUser } from '@/hooks/auth/useUser'
import { useStore } from '@/store'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Success() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 스토어에서 인증 상태 관리 함수 가져오기
  const { auth, user } = useStore()

  useEffect(() => {
    async function processLogin() {
      try {
        const token = searchParams.get('token')
        console.log('token', token)

        const userProfile = await usersApi.getUser()
        console.log('userProfile', userProfile)

        auth.setAuthenticated(true)

        if (userProfile.isAdmin) {
          auth.setAdmin(true)
        }

        user.setUser(userProfile)

        console.log('로그인 성공')

        router.push('/')
      } catch (error) {
        console.error('로그인 실패', error)
        setError('로그인 실패')
      } finally {
        setIsLoading(false)
      }
    }

    processLogin()
  }, [searchParams, router, auth, user])

  // const searchParams = useSearchParams()

  // 토큰 확인 후 페이지 이동
  // kakao/login/success 이 엔드포인트에서 토큰을 확인할 필요가 있나? 바로 메인 페이지로 이동하는게 맞는거 아닐까?

  // useEffect(() => {
  //   const accessToken = searchParams.get('token')
  //   if (accessToken) {
  //     router.push('/')
  //   }
  // }, [searchParams, router])

  return <div>로그인 성공</div>
}
