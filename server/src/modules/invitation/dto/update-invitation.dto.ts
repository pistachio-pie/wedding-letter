import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateInvitationDto } from './create-invitation.dto'

export class UpdateInvitationDto extends PartialType(CreateInvitationDto) {
    @ApiProperty({
        description: '초대장 ID',
        example: 1,
    })
    id: number
}
