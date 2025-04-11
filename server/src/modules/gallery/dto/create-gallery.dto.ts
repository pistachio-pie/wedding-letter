import { ApiProperty } from '@nestjs/swagger'

export class CreateGalleryDto {
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
}
