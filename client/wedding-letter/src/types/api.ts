// api 관련 타입들 정리

// user 관련 타입
export interface User {
  email: string
  name: string
  roll?: number
  // admin 0, 일반 1, 게스트 2
}

// axios 통신 응답 타입
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

// api 에러 타입
export interface ApiError {
  message: string
  code: string
  status: number
}
