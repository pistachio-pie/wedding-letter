import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateGalleryDto } from './create-gallery.dto'

export class UpdateGalleryDto extends PartialType(CreateGalleryDto) {
    @ApiProperty({
        description: '갤러리 이미지 ID',
        example: 1,
    })
    id: number
}
