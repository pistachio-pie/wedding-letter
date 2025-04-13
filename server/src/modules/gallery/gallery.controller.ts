import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
    UseInterceptors,
    UploadedFile,
    HttpException,
    HttpStatus,
} from '@nestjs/common'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiConsumes,
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { GalleryService } from './gallery.service'
import { CreateGalleryDto } from './dto/create-gallery.dto'
import { UpdateGalleryDto } from './dto/update-gallery.dto'
import { GalleryResponseDto } from './dto/gallery-response.dto'
import { Multer } from 'multer'

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

    @Post('upload/:invitationId')
    @ApiOperation({ summary: '갤러리 이미지 업로드' })
    @ApiParam({ name: 'invitationId', description: '초대장 ID' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 201,
        description: '갤러리 이미지 업로드 완료',
        schema: {
            example: {
                id: 1,
                invitationId: 5,
                image_url:
                    'https://wedding-letter01.s3.ap-southeast-2.amazonaws.com/images/1234567890-gallery.jpg',
                description: '웨딩 촬영 사진',
                category: '본식',
                location: '그랜드 힐튼 서울',
                photoDate: '2023-06-10',
                createdAt: '2023-06-15T09:12:34.567Z',
                updatedAt: '2023-06-15T09:12:34.567Z',
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(
        @Param('invitationId') invitationId: string,
        @UploadedFile() file: Multer.File,
        @Body('description') description?: string,
        @Body('category') category?: string,
        @Body('location') location?: string,
        @Body('photoDate') photoDate?: string,
    ): Promise<GalleryResponseDto> {
        if (!file) {
            throw new HttpException(
                '파일이 제공되지 않았습니다.',
                HttpStatus.BAD_REQUEST,
            )
        }

        // 파일 크기 제한 (10MB)
        const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes
        if (file.size > MAX_FILE_SIZE) {
            throw new HttpException(
                '파일 크기는 10MB를 초과할 수 없습니다.',
                HttpStatus.BAD_REQUEST,
            )
        }

        // 이미지 파일 타입 검증
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
        ]
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new HttpException(
                '지원되지 않는 파일 형식입니다. JPEG, PNG, GIF, WebP 형식만 허용됩니다.',
                HttpStatus.BAD_REQUEST,
            )
        }

        return this.galleryService.uploadImage(
            file,
            +invitationId,
            description,
            category,
            location,
            photoDate,
        )
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
