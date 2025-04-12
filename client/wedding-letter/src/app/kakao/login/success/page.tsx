'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Success() {
  const router = useRouter()

  // 일단 확인 안하고 페이지 이동하는 것으로 수정

  useEffect(() => {
    router.push('/')
  }, [router])

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
