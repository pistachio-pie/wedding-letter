'use server'
// 쿠키에 토큰 저장

import { cookies } from 'next/headers'

export async function setAccessToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('accesstoken', token, { httpOnly: true, path: '/' })
}

// 쿠키에 저장된 토큰 확인
export async function getAccessToken() {
  const cookieStore = await cookies()
  return cookieStore.get('access-token')?.value
}
