// api 관련 타입들 정리

export enum Role {
  ADMIN = 0,
  USER = 1,
  GUEST = 2,
}

// 배열 데이터 응답 제네릭 타입
// GET: api/users 응답 타입
// GET: api/users/admin/all 응답 타입
export type ArrayResponse<T> = T[]

// User 객체 타입
export interface User {
  id: number
  name: string
  email: string
  isAdmin: boolean
}

// Profile 객체 타입
// GET: api/users/profile 응답 타입
// GET: api/users/{id} 응답 타입
export interface Profile {
  id: number
  email: string
  name: string
  password?: string
  provider: string | null
  providerId: string | null
  refreshToken?: string
  isAdmin: boolean
  role: Role
  createdAt: string
  updatedAt: string
}

// 공통 기본 응답 인터페이스
export interface BaseResponse {
  success: boolean
  message: string
}

// POST: api/auth/admin/login 응답 타입
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

// axios 통신 응답 타입
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// api 에러 타입
export interface ApiError {
  message: string
  success: boolean
  statusCode?: number
}
