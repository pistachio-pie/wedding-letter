import { ApiProperty } from '@nestjs/swagger'

export class AccountResponseDto {
    @ApiProperty({
        description: '계좌 정보 ID',
        example: 1,
    })
    id: number

    @ApiProperty({
        description: '초대장 ID',
        example: 1,
    })
    invitationId: number

    @ApiProperty({
        description: '계좌 주인 타입',
        example: '신랑',
        enum: ['신랑', '신부'],
    })
    owner_type: string

    @ApiProperty({
        description: '은행명',
        example: '국민은행',
    })
    bank_name: string

    @ApiProperty({
        description: '생성 일시',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt: Date

    @ApiProperty({
        description: '수정 일시',
        example: '2023-01-01T00:00:00.000Z',
    })
    updatedAt: Date
}
