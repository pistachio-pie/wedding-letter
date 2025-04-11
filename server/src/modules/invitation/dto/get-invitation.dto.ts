import { ApiProperty } from '@nestjs/swagger'

export class GetInvitationDto {
    @ApiProperty({
        description: '초대장 ID',
        example: 1,
        required: false,
    })
    id?: number

    @ApiProperty({
        description: '사용자 ID',
        example: 1,
        required: false,
    })
    userId?: number
}
