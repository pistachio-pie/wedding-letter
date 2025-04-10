import { ApiProperty } from '@nestjs/swagger'

export class CommentResponseDto {
    @ApiProperty({
        description: '댓글 ID',
        example: 1,
    })
    id: number

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
        description: '생성 일시',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt: Date

    @ApiProperty({
        description: '수정 일시',
        example: '2023-01-01T00:00:00.000Z',
    })
    updatedAt: Date
}
