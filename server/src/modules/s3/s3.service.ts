import { Injectable } from '@nestjs/common'
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Multer } from 'multer'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class S3Service {
    private s3Client: S3Client
    private bucketName: string

    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId:
                    this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>(
                    'AWS_SECRET_ACCESS_KEY',
                ),
            },
        })
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME')
    }

    async uploadFile(file: Multer.File, key: string): Promise<string> {
        // 파일명에 한글이나 특수문자가 있을 경우 URL 인코딩
        const encodedKey = key
            .split('/')
            .map((part, index) => {
                // 경로의 마지막 부분(파일명)만 인코딩
                return index === key.split('/').length - 1
                    ? encodeURIComponent(part)
                    : part
            })
            .join('/')

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: encodedKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        })

        await this.s3Client.send(command)

        // 업로드된 파일의 URL 반환
        return `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${encodedKey}`
    }

    async generatePresignedUrl(key: string, expiresIn = 3600): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        })

        // 서명된 URL 생성 (초 단위로 만료 시간 설정)
        return await getSignedUrl(this.s3Client, command, { expiresIn })
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        })

        await this.s3Client.send(command)
    }

    async uploadInvitationImage(file: Multer.File): Promise<string> {
        const timestamp = Date.now()
        const uuid = uuidv4().slice(0, 8)
        const key = `invitations/${timestamp}-${uuid}-${file.originalname}`

        return this.uploadFile(file, key)
    }

    /**
     * S3 URL에서 키를 추출하는 헬퍼 메서드
     * @param url S3 URL (예: https://bucket-name.s3.region.amazonaws.com/folder/file.jpg)
     * @returns S3 키 (예: folder/file.jpg)
     */
    extractKeyFromUrl(url: string): string | null {
        try {
            // URL에서 경로 부분만 추출
            const urlObj = new URL(url)
            const pathname = urlObj.pathname

            // 첫 번째 슬래시(/) 제거
            return pathname.startsWith('/') ? pathname.substring(1) : pathname
        } catch (error) {
            return null
        }
    }
}
