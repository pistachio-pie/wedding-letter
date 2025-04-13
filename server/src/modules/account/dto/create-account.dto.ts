import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateAccountDto {
    @ApiProperty({
        description: '계좌 주인 타입',
        example: '신랑',
        enum: ['신랑', '신부'],
    })
    @IsEnum(['신랑', '신부'])
    @IsNotEmpty()
    owner_type: '신랑' | '신부'

    @ApiProperty({
        description: '은행명',
        example: '국민은행',
    })
    @IsString()
    @IsNotEmpty()
    bank_name: string

    @ApiProperty({
        description: '계좌번호',
        example: '123-456-789012',
    })
    @IsString()
    @IsNotEmpty()
    account_number: string

    @ApiProperty({
        description: '예금주',
        example: '김철수',
    })
    @IsString()
    @IsNotEmpty()
    account_holder: string
}
