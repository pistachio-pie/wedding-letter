import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    Get,
    Param,
    Delete,
    HttpException,
    HttpStatus,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { S3Service } from './s3.service'
import {
    ApiTags,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiExtraModels,
    getSchemaPath,
} from '@nestjs/swagger'
import { Multer } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { ApiResponseDto } from 'src/types/api-response.dto'

@ApiTags('S3')
@Controller('s3')
@ApiExtraModels(ApiResponseDto)
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: '파일 업로드' })
    @ApiResponse({
        status: 201,
        description: '파일 업로드 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                url: {
                                    type: 'string',
                                    example:
                                        'https://wedding-letter01.s3.ap-southeast-2.amazonaws.com/images/1234567890-gallery.jpg',
                                    description: '업로드된 파일의 URL',
                                },
                                key: {
                                    type: 'string',
                                    example: 'images/1234567890-gallery.jpg',
                                    description: 'S3에 저장된 파일의 키',
                                },
                            },
                        },
                    },
                },
            ],
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Multer.File,
        @Body('folder') folder: string = 'images',
    ) {
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

        try {
            // UUID와 타임스탬프를 사용하여 고유한 파일명 생성
            const uuid = uuidv4().slice(0, 8)
            const timestamp = Date.now()
            const key = `${folder}/${timestamp}-${uuid}-${file.originalname}`

            // S3에 파일 업로드
            const fileUrl = await this.s3Service.uploadFile(file, key)

            return {
                url: fileUrl,
                key: key,
                message: '파일 업로드 성공',
            }
        } catch (error) {
            throw new HttpException(
                `파일 업로드 오류: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    @Post('upload/invitation')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: '초대장 이미지 업로드' })
    @ApiResponse({
        status: 201,
        description: '초대장 이미지 업로드 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                url: {
                                    type: 'string',
                                    example:
                                        'https://wedding-letter01.s3.ap-southeast-2.amazonaws.com/invitations/1234567890-wedding.jpg',
                                    description:
                                        '업로드된 이미지의 URL (초대장 생성 시 image_url로 사용)',
                                },
                            },
                        },
                    },
                },
            ],
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadInvitationImage(@UploadedFile() file: Multer.File) {
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

        try {
            // S3에 초대장 이미지 업로드 (전용 메서드 사용)
            const fileUrl = await this.s3Service.uploadInvitationImage(file)

            return {
                url: fileUrl,
                message: '초대장 이미지 업로드 성공',
            }
        } catch (error) {
            throw new HttpException(
                `파일 업로드 오류: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    @Get('presigned-url/:fileName')
    @ApiOperation({ summary: '프리사인된 URL 생성' })
    @ApiResponse({
        status: 200,
        description: '프리사인된 URL 생성 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                presignedUrl: {
                                    type: 'string',
                                    example:
                                        'https://wedding-letter01.s3.ap-southeast-2.amazonaws.com/images/sample.jpg?X-Amz-Algorithm=...',
                                },
                                key: {
                                    type: 'string',
                                    example: 'images/sample.jpg',
                                },
                            },
                        },
                    },
                },
            ],
        },
    })
    async generatePresignedUrl(
        @Param('fileName') fileName: string,
        @Body('folder') folder: string = 'images',
    ) {
        try {
            const key = `${folder}/${fileName}`
            const presignedUrl = await this.s3Service.generatePresignedUrl(key)

            return {
                presignedUrl,
                key,
                message: '프리사인된 URL 생성 성공',
            }
        } catch (error) {
            throw new HttpException(
                `프리사인된 URL 생성 오류: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    @Delete('delete/:key')
    @ApiOperation({ summary: '파일 삭제' })
    @ApiResponse({
        status: 200,
        description: '파일 삭제 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        success: { example: true },
                        message: { example: '파일 삭제 성공' },
                        data: { example: null },
                    },
                },
            ],
        },
    })
    async deleteFile(@Param('key') key: string) {
        try {
            await this.s3Service.deleteFile(key)
            return {
                message: '파일 삭제 성공',
            }
        } catch (error) {
            throw new HttpException(
                `파일 삭제 오류: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
}
