'use server'
// 쿠키에 토큰 저장

import { cookies } from 'next/headers'

export async function setAccessToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('accesstoken', token, { httpOnly: true, path: '/' })
}
