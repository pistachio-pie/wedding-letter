/**
 * API 응답 인터페이스
 */
export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
    timestamp: number
}
