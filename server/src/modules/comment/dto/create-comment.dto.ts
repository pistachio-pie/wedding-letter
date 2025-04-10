import { ApiProperty } from '@nestjs/swagger'

export class CreateCommentDto {
    @ApiProperty({
        description: '초대장 ID',
        example: 1,
    })
    invitationId: number

    @ApiProperty({
        description: '작성자 이름',
        example: '홍길동',
    })
    author_name: string

    @ApiProperty({
        description: '메시지 내용',
        example: '결혼을 축하합니다! 행복하게 오래오래 사세요~',
    })
    message: string

    @ApiProperty({
        description: '댓글 비밀번호 (삭제시 필요)',
        example: '1234',
    })
    password: string
}
