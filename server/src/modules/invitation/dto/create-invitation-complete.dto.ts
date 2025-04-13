import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsNotEmpty,
    IsOptional,
    ValidateNested,
    IsArray,
} from 'class-validator'
import { CreateAccountDto } from '../../account/dto/create-account.dto'
import { CreateGalleryDto } from '../../gallery/dto/create-gallery.dto'
import { CreateInvitationDto } from './create-invitation.dto'

export class CreateInvitationCompleteDto {
    @ApiProperty({
        description: '초대장 정보',
        type: CreateInvitationDto,
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateInvitationDto)
    invitation: CreateInvitationDto

    @ApiProperty({
        description: '계좌 정보 목록 (선택사항)',
        type: [CreateAccountDto],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAccountDto)
    accounts?: CreateAccountDto[]

    @ApiProperty({
        description:
            '갤러리 이미지 목록 (선택사항, invitationId는 자동으로 설정됨)',
        type: [CreateGalleryDto],
        required: false,
        example: [
            {
                image_url:
                    'https://wedding-letter01.s3.ap-southeast-2.amazonaws.com/invitations/1234567890-wedding.jpg',
                description: '웨딩 촬영 사진',
                category: '본식',
                location: '그랜드 힐튼 서울',
                photoDate: '2023-06-10',
            },
        ],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateGalleryDto)
    galleryImages?: CreateGalleryDto[]
}
