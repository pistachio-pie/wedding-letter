import { ApiProperty } from '@nestjs/swagger'

export class CreateAccountDto {
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
    owner_type: '신랑' | '신부'

    @ApiProperty({
        description: '은행명',
        example: '국민은행',
    })
    bank_name: string
}
