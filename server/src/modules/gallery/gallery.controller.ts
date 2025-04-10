import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
} from '@nestjs/common'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger'
import { GalleryService } from './gallery.service'
import { CreateGalleryDto } from './dto/create-gallery.dto'
import { UpdateGalleryDto } from './dto/update-gallery.dto'
import { GalleryResponseDto } from './dto/gallery-response.dto'

@ApiTags('gallery')
@Controller('gallery')
export class GalleryController {
    constructor(private readonly galleryService: GalleryService) {}

    @Get()
    @ApiOperation({ summary: '모든 갤러리 이미지 조회' })
    @ApiQuery({
        name: 'invitationId',
        description: '초대장 ID로 필터링(선택사항)',
        required: false,
        type: Number,
    })
    @ApiResponse({
        status: 200,
        description: '갤러리 이미지 목록 반환',
        type: [GalleryResponseDto],
    })
    async findAll(
        @Query('invitationId') invitationId?: string,
    ): Promise<GalleryResponseDto[]> {
        if (invitationId) {
            return this.galleryService.findByInvitationId(+invitationId)
        }
        return this.galleryService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: '특정 갤러리 이미지 조회' })
    @ApiParam({ name: 'id', description: '갤러리 이미지 ID' })
    @ApiResponse({
        status: 200,
        description: '갤러리 이미지 정보 반환',
        type: GalleryResponseDto,
    })
    findOne(@Param('id') id: string): Promise<GalleryResponseDto> {
        return this.galleryService.findOne(+id)
    }

    @Get('invitation/:invitationId')
    @ApiOperation({ summary: '초대장별 갤러리 이미지 조회' })
    @ApiParam({ name: 'invitationId', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장별 갤러리 이미지 목록 반환',
        type: [GalleryResponseDto],
    })
    findByInvitationId(
        @Param('invitationId') invitationId: string,
    ): Promise<GalleryResponseDto[]> {
        return this.galleryService.findByInvitationId(+invitationId)
    }

    @Post()
    @ApiOperation({ summary: '갤러리 이미지 생성' })
    @ApiResponse({
        status: 201,
        description: '갤러리 이미지 생성 완료',
        type: GalleryResponseDto,
    })
    create(
        @Body() createGalleryDto: CreateGalleryDto,
    ): Promise<GalleryResponseDto> {
        return this.galleryService.create(createGalleryDto)
    }

    @Put(':id')
    @ApiOperation({ summary: '갤러리 이미지 업데이트' })
    @ApiParam({ name: 'id', description: '갤러리 이미지 ID' })
    @ApiResponse({
        status: 200,
        description: '갤러리 이미지 업데이트 완료',
        type: GalleryResponseDto,
    })
    update(
        @Param('id') id: string,
        @Body() updateGalleryDto: UpdateGalleryDto,
    ): Promise<GalleryResponseDto> {
        return this.galleryService.update(+id, updateGalleryDto)
    }

    @Delete(':id')
    @ApiOperation({ summary: '갤러리 이미지 삭제' })
    @ApiParam({ name: 'id', description: '갤러리 이미지 ID' })
    @ApiResponse({
        status: 200,
        description: '갤러리 이미지 삭제 완료',
    })
    remove(@Param('id') id: string): Promise<void> {
        return this.galleryService.remove(+id)
    }
}
