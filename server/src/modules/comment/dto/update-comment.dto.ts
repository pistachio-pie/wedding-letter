import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateCommentDto } from './create-comment.dto'

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
    @ApiProperty({
        description: '댓글 ID',
        example: 1,
    })
    id: number

    @ApiProperty({
        description: '비밀번호 (인증용)',
        example: '1234',
    })
    password: string
}
