export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}

// 공통 기본 응답 인터페이스
export interface SingleResponse<T> {
  data: T
  success: boolean
  message: string
  timestamp: number
}

export interface ListResponse<T> {
  data: T[]
  success: boolean
  message: string
  timestamp: number
}

// api 에러 타입
export interface ApiError {
  message: string
  success: boolean
  statusCode?: number
}

// 조회 요청 parameter 타입
export interface Params {
  userId?: number
  page?: number
  limit?: number
}
