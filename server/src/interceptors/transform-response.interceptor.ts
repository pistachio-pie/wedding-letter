import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { ResponseTransformer } from './response-transformer'

/**
 * API 응답을 일관된 형식으로 변환하는 인터셉터
 */
@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
    /**
     * 인터셉터 실행 메서드
     * @param context 실행 컨텍스트
     * @param next 다음 핸들러
     * @returns 변환된 응답 데이터 스트림
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // 요청 핸들러에서 응답 데이터를 가져와 변환
        return next.handle().pipe(
            map((data) => {
                // 이미 형식이 지정된 응답인 경우 그대로 반환
                if (data && data.success !== undefined) {
                    return data
                }

                // 형식이 지정되지 않은 응답을 변환
                return ResponseTransformer.success(data)
            }),
            catchError((err) => {
                // HttpException인 경우 해당 상태 코드와 메시지 사용
                if (err instanceof HttpException) {
                    const response = err.getResponse()
                    const status = err.getStatus()
                    const message =
                        typeof response === 'object' && response['message']
                            ? response['message']
                            : typeof response === 'string'
                              ? response
                              : '오류가 발생했습니다.'

                    const errorResponse = ResponseTransformer.error(
                        Array.isArray(message) ? message.join(', ') : message,
                        { statusCode: status },
                    )

                    // 원래의 상태 코드를 유지하면서 변환된 응답 형식 전달
                    throw new HttpException(errorResponse, status)
                }

                // 일반 오류인 경우 500 내부 서버 오류로 처리
                const errorResponse = ResponseTransformer.error(
                    err.message || '내부 서버 오류가 발생했습니다.',
                    { statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
                )

                throw new HttpException(
                    errorResponse,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                )
            }),
        )
    }
}
