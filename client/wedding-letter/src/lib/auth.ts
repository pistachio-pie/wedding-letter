'use client'

// 이것은 서버용 쿠키
// import { cookies } from 'next/headers'

// 이것은 클라이언트용 쿠키
import Cookies from 'js-cookie'

// 일단 백에서 토큰이 쿠키에 자동 저장 되므로 set함수는 필요 없을 듯

// 쿠키에 저장된 토큰 확인
// 클라이언트용 쿠키 접근 함수
export function getAccessToken() {
  return Cookies.get('access-token') || null
}

// 쿠키에 저장된 토큰 삭제
export function removeTokens() {
  Cookies.remove('access-token')
  // Cookies.remove('refresh_token')
  // refresh token 은 httpOnly 속성이므로 삭제 불가
}

// 서버용 쿠키 접근 함수
// export async function getAccessTokenServer() {
//   const cookieStore = await cookies()
//   return cookieStore.get('access-token')?.value
// }
