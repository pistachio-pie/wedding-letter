import { ApiProperty } from '@nestjs/swagger'
import { AccountResponseDto } from '../../account/dto/account-response.dto'
import { GalleryResponseDto } from '../../gallery/dto/gallery-response.dto'
import { InvitationResponseDto } from './invitation-response.dto'

export class InvitationResponseCompleteDto {
    @ApiProperty({
        description: '초대장 정보',
        type: InvitationResponseDto,
    })
    invitation: InvitationResponseDto

    @ApiProperty({
        description: '계좌 정보 목록',
        type: [AccountResponseDto],
        required: false,
    })
    accounts: AccountResponseDto[]

    @ApiProperty({
        description: '갤러리 이미지 목록',
        type: [GalleryResponseDto],
        required: false,
    })
    galleryImages: GalleryResponseDto[]
}
