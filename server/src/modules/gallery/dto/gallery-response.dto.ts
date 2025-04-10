import { ApiProperty } from '@nestjs/swagger'

export class GalleryResponseDto {
    @ApiProperty({
        description: '갤러리 이미지 ID',
        example: 1,
    })
    id: number

    @ApiProperty({
        description: '초대장 ID',
        example: 1,
    })
    invitationId: number

    @ApiProperty({
        description: '이미지 URL',
        example: 'https://example.com/images/wedding1.jpg',
    })
    image_url: string

    @ApiProperty({
        description: '이미지 설명',
        example: '웨딩 촬영 사진',
        required: false,
    })
    description?: string

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
