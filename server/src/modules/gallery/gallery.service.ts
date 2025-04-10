import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Gallery } from './entities/gallery.entity'

@Injectable()
export class GalleryService {
    constructor(
        @InjectRepository(Gallery)
        private galleryRepository: Repository<Gallery>,
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
        await this.galleryRepository.delete(id)
    }

    async removeByInvitationId(invitationId: number): Promise<void> {
        await this.galleryRepository.delete({ invitationId })
    }
}
