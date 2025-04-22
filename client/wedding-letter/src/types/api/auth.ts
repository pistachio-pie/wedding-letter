// POST: api/auth/admin/login 응답 타입

import { Role } from './common'

// User 객체 타입
export interface User {
  id: number
  name: string
  email: string
  role: Role
}

// POST: api/auth/admin/register 응답 타입
export interface AdminResponse {
  user: User
}

// 관리자 계정 login, register 요청 데이터 타입
export interface AdminRequest {
  name?: string
  email: string
  password: string
}
