import { ApiProperty } from '@nestjs/swagger'

/**
 * 초대장 목록 조회용 간소화된 DTO
 */
export class InvitationListResponseDto {
    @ApiProperty({
        description: '초대장 ID',
        example: 1,
    })
    id: number

    @ApiProperty({
        description: '사용자 ID',
        example: 1,
    })
    userId: number

    @ApiProperty({
        description: '신랑 이름',
        example: '김철수',
    })
    groom_name: string

    @ApiProperty({
        description: '신부 이름',
        example: '이영희',
    })
    bride_name: string

    @ApiProperty({
        description: '결혼식 날짜',
        example: '2024-12-25',
    })
    wedding_date: Date

    @ApiProperty({
        description: '결혼식장 이름',
        example: '그랜드볼룸',
    })
    venue_name: string

    @ApiProperty({
        description: '초대장 URL',
        example: 'https://wedding.example.com/invitation/123',
    })
    invitation_url: string

    @ApiProperty({
        description: '생성 일시',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt: Date

    @ApiProperty({
        description: '삭제 일시',
        example: '2023-01-10T00:00:00.000Z',
        required: false,
        nullable: true,
    })
    deletedAt?: Date
}
