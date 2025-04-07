'use client'

import { setAccessToken } from '@/lib/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function Success() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const accessToken = searchParams.get('token')
    if (accessToken) {
      setAccessToken(accessToken)
      router.push('/')
    }
  }, [searchParams, router])

  return <div>그래요</div>
}
