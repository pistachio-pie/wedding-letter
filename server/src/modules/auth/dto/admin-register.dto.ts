import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class AdminRegisterDto {
    @ApiProperty({
        example: '관리자',
        description: '관리자 이름',
    })
    @IsNotEmpty({ message: '이름은 필수입니다' })
    @IsString()
    name: string

    @ApiProperty({
        example: 'admin@example.com',
        description: '관리자 이메일',
    })
    @IsNotEmpty({ message: '이메일은 필수입니다' })
    @IsEmail({}, { message: '유효한 이메일 형식이 아닙니다' })
    email: string

    @ApiProperty({
        example: 'securepassword',
        description: '관리자 비밀번호',
    })
    @IsNotEmpty({ message: '비밀번호는 필수입니다' })
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
    password: string
}
