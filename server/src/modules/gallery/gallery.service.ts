import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Gallery } from './entities/gallery.entity'
import { S3Service } from '../s3/s3.service'
import { Multer } from 'multer'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class GalleryService {
    constructor(
        @InjectRepository(Gallery)
        private galleryRepository: Repository<Gallery>,
        private s3Service: S3Service,
    ) {}

    async findAll(): Promise<Gallery[]> {
        return this.galleryRepository.find()
    }

    async findOne(id: number): Promise<Gallery> {
        return this.galleryRepository.findOne({ where: { id } })
    }

    async findByInvitationId(invitationId: number): Promise<Gallery[]> {
        return this.galleryRepository.find({ where: { invitationId } })
    }

    async create(gallery: Partial<Gallery>): Promise<Gallery> {
        const newGallery = this.galleryRepository.create(gallery)
        return this.galleryRepository.save(newGallery)
    }

    async update(id: number, gallery: Partial<Gallery>): Promise<Gallery> {
        await this.galleryRepository.update(id, gallery)
        return this.galleryRepository.findOne({ where: { id } })
    }

    async remove(id: number): Promise<void> {
        const gallery = await this.findOne(id)
        if (gallery && gallery.image_url) {
            // S3 URL에서 키 추출
            const key = this.s3Service.extractKeyFromUrl(gallery.image_url)
            if (key) {
                // S3에서 이미지 삭제
                await this.s3Service.deleteFile(key)
            }
        }
        await this.galleryRepository.delete(id)
    }

    async removeByInvitationId(invitationId: number): Promise<void> {
        // S3에서도 이미지 삭제
        const galleries = await this.findByInvitationId(invitationId)
        for (const gallery of galleries) {
            if (gallery.image_url) {
                const key = this.s3Service.extractKeyFromUrl(gallery.image_url)
                if (key) {
                    await this.s3Service.deleteFile(key)
                }
            }
        }
        await this.galleryRepository.delete({ invitationId })
    }

    async uploadImage(
        file: Multer.File,
        invitationId: number,
        description?: string,
        category?: string,
        location?: string,
        photoDate?: string,
    ): Promise<Gallery> {
        // S3에 이미지 업로드
        const timestamp = Date.now()
        const uuid = uuidv4().slice(0, 8)
        const key = `images/${timestamp}-${uuid}-${file.originalname}`
        const fileUrl = await this.s3Service.uploadFile(file, key)

        // 갤러리 엔티티에 저장 (타입 캐스팅으로 컴파일러 경고 방지)
        return this.create({
            invitationId,
            image_url: fileUrl,
            description,
            category,
            location,
            photoDate,
        } as Partial<Gallery>)
    }
}
