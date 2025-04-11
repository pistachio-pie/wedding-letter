import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    MinLength,
    MaxLength,
} from 'class-validator'

export class CreateCommentDto {
    @ApiProperty({
        description: '초대장 ID',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    invitationId: number

    @ApiProperty({
        description: '작성자 이름',
        example: '홍길동',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    author_name: string

    @ApiProperty({
        description: '메시지 내용',
        example: '결혼을 축하합니다! 행복하게 오래오래 사세요~',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(1000)
    message: string

    @ApiProperty({
        description: '댓글 비밀번호 (삭제시 필요)',
        example: '1234',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    password: string
}
