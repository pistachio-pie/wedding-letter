import { ApiResponse } from '../types/api-response.interface'

/**
 * API 응답 형식을 변환하는 유틸리티 클래스
 */
export class ResponseTransformer {
    /**
     * 성공 응답을 생성합니다.
     * @param data 응답 데이터
     * @param message 성공 메시지
     * @returns 형식화된 API 응답
     */
    static success<T>(
        data: T,
        message: string = '성공적으로 처리되었습니다.',
    ): ApiResponse<T> {
        return {
            success: true,
            message,
            data,
            timestamp: Date.now(),
        }
    }

    /**
     * 실패 응답을 생성합니다.
     * @param message 오류 메시지
     * @param data 추가 데이터 (선택 사항)
     * @returns 형식화된 API 응답
     */
    static error<T = null>(message: string, data: T = null): ApiResponse<T> {
        return {
            success: false,
            message,
            data,
            timestamp: Date.now(),
        }
    }
}
