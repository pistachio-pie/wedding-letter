export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}

// 배열 데이터 응답 제네릭 타입
// GET: api/users 응답 타입
// GET: api/users/admin/all 응답 타입
export type ArrayResponse<T> = T[]

// 공통 기본 응답 인터페이스
export interface BaseResponse {
  success: boolean
  message: string
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
