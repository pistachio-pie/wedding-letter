import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsNotEmpty,
    IsOptional,
    ValidateNested,
    IsArray,
    IsNumber,
} from 'class-validator'
import { UpdateInvitationDto } from './update-invitation.dto'
import { CreateAccountDto } from '../../account/dto/create-account.dto'
import { CreateGalleryDto } from '../../gallery/dto/create-gallery.dto'

export class UpdateInvitationCompleteDto {
    @ApiProperty({
        description: '초대장 정보',
        type: UpdateInvitationDto,
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => UpdateInvitationDto)
    invitation: UpdateInvitationDto

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
        description: '갤러리 이미지 목록 (선택사항)',
        type: [CreateGalleryDto],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateGalleryDto)
    galleryImages?: CreateGalleryDto[]
}
