import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateRsvpDto } from './create-rsvp.dto'

export class UpdateRsvpDto extends PartialType(CreateRsvpDto) {
    @ApiProperty({
        description: 'RSVP ID',
        example: 1,
    })
    id: number
}
