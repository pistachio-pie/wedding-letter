import { Injectable, NotFoundException } from '@nestjs/common'
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
        return this.galleryRepository.find({ withDeleted: false })
    }

    async findOne(id: number): Promise<Gallery> {
        return this.galleryRepository.findOne({
            where: { id },
            withDeleted: false,
        })
    }

    async findByInvitationId(invitationId: number): Promise<Gallery[]> {
        return this.galleryRepository.find({
            where: { invitationId },
            withDeleted: false,
        })
    }

    // 삭제된 갤러리 포함하여 조회 (복구용)
    async findByInvitationIdWithDeleted(
        invitationId: number,
    ): Promise<Gallery[]> {
        return this.galleryRepository.find({
            where: { invitationId },
            withDeleted: true,
        })
    }

    async create(gallery: Partial<Gallery>): Promise<Gallery> {
        const newGallery = this.galleryRepository.create(gallery)
        return this.galleryRepository.save(newGallery)
    }

    async update(id: number, gallery: Partial<Gallery>): Promise<Gallery> {
        await this.galleryRepository.update(id, gallery)
        return this.galleryRepository.findOne({ where: { id } })
    }

    // 단일 갤러리 소프트 삭제
    async remove(id: number): Promise<void> {
        const gallery = await this.galleryRepository.findOne({
            where: { id },
            withDeleted: false,
        })

        if (!gallery) {
            throw new NotFoundException(
                `ID가 ${id}인 갤러리 이미지를 찾을 수 없습니다.`,
            )
        }

        // 소프트 삭제 시 S3 이미지는 삭제하지 않음
        await this.galleryRepository.softDelete(id)
    }

    // 초대장 ID로 연결된 모든 갤러리 소프트 삭제
    async removeByInvitationId(invitationId: number): Promise<void> {
        const galleries = await this.findByInvitationId(invitationId)

        if (galleries.length > 0) {
            await this.galleryRepository.softDelete({ invitationId })
        }
    }

    // 단일 갤러리 완전 삭제 (관리자용)
    async hardRemove(id: number): Promise<void> {
        const gallery = await this.galleryRepository.findOne({
            where: { id },
            withDeleted: true,
        })

        if (!gallery) {
            throw new NotFoundException(
                `ID가 ${id}인 갤러리 이미지를 찾을 수 없습니다.`,
            )
        }

        // 하드 삭제 시 S3 이미지도 함께 삭제
        if (gallery.image_url) {
            const key = this.s3Service.extractKeyFromUrl(gallery.image_url)
            if (key) {
                await this.s3Service.deleteFile(key)
            }
        }

        await this.galleryRepository.delete(id)
    }

    // 초대장 ID로 연결된 모든 갤러리 완전 삭제 (관리자용)
    async hardRemoveByInvitationId(invitationId: number): Promise<void> {
        // S3에서도 이미지 삭제
        const galleries = await this.findByInvitationIdWithDeleted(invitationId)
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

    // 단일 갤러리 복구
    async restore(id: number): Promise<Gallery> {
        const gallery = await this.galleryRepository.findOne({
            where: { id },
            withDeleted: true,
        })

        if (!gallery) {
            throw new NotFoundException(
                `ID가 ${id}인 갤러리 이미지를 찾을 수 없습니다.`,
            )
        }

        await this.galleryRepository.restore(id)
        return this.findOne(id)
    }

    // 초대장 ID로 연결된 모든 갤러리 복구
    async restoreByInvitationId(invitationId: number): Promise<Gallery[]> {
        const galleries = await this.findByInvitationIdWithDeleted(invitationId)

        if (galleries.length > 0) {
            await this.galleryRepository.restore({ invitationId })
        }

        return this.findByInvitationId(invitationId)
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
