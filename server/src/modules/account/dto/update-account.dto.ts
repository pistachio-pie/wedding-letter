import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateAccountDto } from './create-account.dto'

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
    @ApiProperty({
        description: '계좌 정보 ID',
        example: 1,
    })
    id: number
}
