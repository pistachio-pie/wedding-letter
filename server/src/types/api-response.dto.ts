import { ApiProperty } from '@nestjs/swagger'

/**
 * API 응답 스키마 DTO
 * 스웨거 문서에 표시할 응답 형식을 정의합니다.
 */
export class ApiResponseDto<T> {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean

    @ApiProperty({
        description: '응답 메시지',
        example: '성공적으로 처리되었습니다.',
    })
    message: string

    @ApiProperty({
        description: '응답 데이터',
    })
    data: T

    @ApiProperty({
        description: '응답 타임스탬프',
        example: 1681234567890,
    })
    timestamp: number
}
