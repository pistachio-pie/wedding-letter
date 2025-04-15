// POST: api/auth/admin/login 응답 타입

import { BaseResponse } from './common'

// User 객체 타입
export interface User {
  id: number
  name: string
  email: string
  isAdmin: boolean
}

// POST: api/auth/admin/register 응답 타입
export interface AdminResponse extends BaseResponse {
  user: User
  accessToken: string
}

// 관리자 계정 login, register 요청 데이터 타입
export interface AdminRequest {
  name?: string
  email: string
  password: string
}
