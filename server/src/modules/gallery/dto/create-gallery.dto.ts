import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateGalleryDto {
    @ApiProperty({
        description:
            '초대장 ID (초대장 생성 시에는 필요 없음, 서버에서 자동 설정)',
        example: 1,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    invitationId?: number

    @ApiProperty({
        description: '이미지 URL',
        example: 'https://example.com/images/wedding1.jpg',
    })
    @IsString()
    image_url: string

    @ApiProperty({
        description: '이미지 설명',
        example: '웨딩 촬영 사진',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty({
        description: '사진 카테고리 (예: 본식, 스튜디오, 리셉션 등)',
        example: '본식',
        required: false,
    })
    @IsOptional()
    @IsString()
    category?: string

    @ApiProperty({
        description: '사진 촬영 장소',
        example: '그랜드 힐튼 서울',
        required: false,
    })
    @IsOptional()
    @IsString()
    location?: string

    @ApiProperty({
        description: '사진 촬영 날짜',
        example: '2023-06-10',
        required: false,
    })
    @IsOptional()
    @IsString()
    photoDate?: string
}
