import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { Multer } from 'multer'

export class UploadFileDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: '업로드할 파일',
    })
    file: Multer.File

    @ApiProperty({
        required: false,
        description: '파일 저장 폴더 경로 (기본값: images)',
    })
    @IsOptional()
    @IsString()
    folder?: string = 'images'
}
